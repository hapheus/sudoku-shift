import React, { useMemo, useState } from 'react';
import { getVariantSpec, inferVariantFromBoardLength } from '../domain/sudoku-generator.js';
import { checkProtocolCompatibility } from '../services/multiplayer-protocol.js';
import { isValidGameId } from '../services/online-game-client.js';
import { formatPlayerTag } from '../services/player-name.js';
import { formatGameDuration } from '../utils/format-duration.js';
import enMessages from '../locales/en.json';
import { PlayerTag } from './PlayerTag.jsx';

function resolveRoomLabels(game, difficultyLabels, pendingJoinGameId, messages) {
    const inferredVariant = game.variant || inferVariantFromBoardLength(game.total_cells);
    const spec = getVariantSpec(inferredVariant);
    const totalCells = spec.totalCells;
    const filledCount = Math.max(
        0,
        Math.min(totalCells, parseInt(game.filled_count ?? game.moves_count ?? 0, 10) || 0),
    );
    const diffLabel = difficultyLabels[game.difficulty] || messages.diffMedium;
    const hasGuest = Boolean(game.has_guest);
    const joinPolicy = game.join_policy || 'auto';
    const compat = checkProtocolCompatibility(game);
    const updateRequired = !compat.compatible && compat.requiresUpdate === 'local';
    const joinsDisabled = joinPolicy === 'disabled' || updateRequired;
    const isPendingJoin = pendingJoinGameId === game.game_id;
    const durationText = Number.isFinite(game.elapsed_seconds)
        ? formatGameDuration(game.elapsed_seconds)
        : null;
    const hostTag = game.host_name
        ? formatPlayerTag(game.host_name, game.host_tag || game.id || game.game_id)
        : null;

    let statusLabel = messages.watchOpen;
    if (updateRequired) {
        statusLabel = messages.watchUpdateRequired || 'Update required';
    } else if (hasGuest) {
        statusLabel = messages.watchCoop;
    } else if (joinPolicy === 'disabled') {
        statusLabel = messages.watchJoinsClosed || 'Watching only';
    } else if (joinPolicy === 'confirm') {
        statusLabel = messages.watchOpenConfirm || 'Approval needed';
    }

    let joinBtnLabel = messages.watchJoin;
    if (updateRequired) {
        joinBtnLabel = messages.watchJoin;
    } else if (joinsDisabled) {
        joinBtnLabel = messages.watchJoinsDisabled || 'Closed';
    } else if (isPendingJoin) {
        joinBtnLabel = messages.watchJoinPending || 'Waiting...';
    }

    const metaText = [
        spec.shortLabel,
        diffLabel,
        statusLabel,
        `${filledCount}/${totalCells}`,
        durationText,
        game.tic_tac_toe ? (messages?.watchTicTacToeTag || 'Tic Tac Toe') : null,
    ].filter(Boolean).join(' • ');

    return { hostTag, metaText, joinsDisabled, updateRequired, joinBtnLabel };
}

function WatchGameCard({
    game,
    difficultyLabels,
    pendingJoinGameId,
    onJoinGame,
    onWatchGame,
    messages,
}) {
    const { hostTag, metaText, joinsDisabled, updateRequired, joinBtnLabel } = resolveRoomLabels(
        game,
        difficultyLabels,
        pendingJoinGameId,
        messages,
    );
    return (
        <li className="live-game-card">
            <div className="live-game-card__info">
                <span className="live-game-card__title">
                    {hostTag ? <PlayerTag tag={hostTag} /> : `Room #${game.game_id.slice(0, 8)}`}
                </span>
                <span className="live-game-card__meta">
                    {metaText}
                </span>
            </div>
            <div className="live-game-card__actions">
                {onJoinGame && (
                    <button
                        type="button"
                        className="live-game-card__join-btn"
                        data-join-id={game.game_id}
                        disabled={joinsDisabled || Boolean(game.tic_tac_toe) || Boolean(pendingJoinGameId)}
                        onClick={() => onJoinGame(game.game_id)}
                    >
                        {joinBtnLabel}
                    </button>
                )}
                <button
                    type="button"
                    className="live-game-card__action-btn"
                    data-watch-id={game.game_id}
                    disabled={updateRequired}
                    onClick={() => onWatchGame(game.game_id)}
                >
                    {messages.watchLiveBtn}
                </button>
            </div>
        </li>
    );
}

export function WatchDirectory({
    rooms,
    connectionStatus = 'connected',
    onReconnect = null,
    onRefresh,
    onWatchGame,
    onJoinGame = null,
    pendingJoinGameId = null,
    onCancelJoinRequest = null,
    messages = enMessages,
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [variantFilter, setVariantFilter] = useState('all'); // 'all' | '3x3' | '2x3'

    const difficultyLabels = useMemo(() => ({
        easy: messages.diffEasy,
        medium: messages.diffMedium,
        hard: messages.diffHard,
        expert: messages.diffExpert,
    }), [messages.diffEasy, messages.diffExpert, messages.diffHard, messages.diffMedium]);

    const liveGames = useMemo(() => {
        const seenGameIds = new Set();
        const result = [];
        for (const room of rooms || []) {
            if (!room || !isValidGameId(room.game_id) || room.status === 'solved' || room.status === 'finished') {
                continue;
            }
            if (seenGameIds.has(room.game_id)) {
                continue;
            }
            seenGameIds.add(room.game_id);
            result.push(room);
        }
        return result;
    }, [rooms]);

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filteredGames = useMemo(() => liveGames.filter((game) => {
        const inferredVariant = game.variant || inferVariantFromBoardLength(game.total_cells);
        const spec = getVariantSpec(inferredVariant);
        const hasGuest = Boolean(game.has_guest);
        const joinPolicy = game.join_policy || 'auto';

        if (statusFilter === 'open' && (hasGuest || joinPolicy === 'disabled')) {
            return false;
        }
        if (statusFilter === 'coop' && !hasGuest) {
            return false;
        }
        if (statusFilter === 'closed' && (hasGuest || joinPolicy !== 'disabled')) {
            return false;
        }
        if (variantFilter !== 'all' && spec.id !== variantFilter) {
            return false;
        }
        if (normalizedQuery) {
            const diffLabel = difficultyLabels[game.difficulty] || messages.diffMedium || '';
            const hostTag = game.host_name
                ? formatPlayerTag(game.host_name, game.host_tag || game.id || game.game_id)
                : null;
            const haystack = [
                hostTag,
                game.host_name,
                game.game_id,
                diffLabel,
                game.difficulty,
                spec.shortLabel,
                spec.id,
            ].filter(Boolean).join(' ').toLowerCase();
            if (!haystack.includes(normalizedQuery)) {
                return false;
            }
        }
        return true;
    }), [difficultyLabels, liveGames, messages.diffMedium, normalizedQuery, statusFilter, variantFilter]);

    const hasActiveFilters = Boolean(normalizedQuery || statusFilter !== 'all' || variantFilter !== 'all');
    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setVariantFilter('all');
    };

    const canReconnect = connectionStatus === 'failed' || connectionStatus === 'disconnected' || connectionStatus === 'unavailable';
    const connectionLabels = {
        connected: messages.connectionLive || 'Live',
        connecting: messages.connectionConnecting || 'Connecting...',
        unavailable: messages.connectionUnavailable || 'Offline',
        failed: messages.connectionFailed || 'Connection lost',
        disconnected: messages.connectionDisconnected || 'Disconnected',
    };

    return (
        <section id="watch-directory" className="watch-box" aria-label={messages.watchTitle}>
            <div className="watch-box__header">
                <h1 className="watch-box__title">{messages.watchTitle}</h1>
                <div className="watch-box__actions">
                    <span className={`connection-badge connection-badge--${connectionStatus}`} aria-live="polite">
                        {connectionLabels[connectionStatus] || connectionStatus}
                    </span>
                    {canReconnect && onReconnect && (
                        <button
                            type="button"
                            className="connection-retry-btn"
                            onClick={onReconnect}
                        >
                            {messages.reconnect || 'Reconnect'}
                        </button>
                    )}
                </div>
            </div>
            {pendingJoinGameId && (
                <div className="join-pending-banner" role="status">
                    <span className="join-pending-banner__text">
                        {messages.joinPendingLabel || 'Waiting for host approval...'}
                    </span>
                    {onCancelJoinRequest && (
                        <button
                            type="button"
                            className="join-pending-banner__cancel-btn"
                            onClick={onCancelJoinRequest}
                        >
                            {messages.cancelJoinRequest || 'Cancel'}
                        </button>
                    )}
                </div>
            )}
            <div className="watch-filters">
                <label htmlFor="watch-search-input" className="sr-only">
                    {messages.watchSearchLabel || 'Search live games'}
                </label>
                <input
                    id="watch-search-input"
                    type="search"
                    className="watch-filters__search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={messages.watchSearchPlaceholder || 'Search by player, room, or difficulty...'}
                />
                <div className="watch-filters__field">
                    <label htmlFor="watch-joins-filter">{messages.watchFilterJoins || 'Joins'}</label>
                    <select
                        id="watch-joins-filter"
                        className="watch-filters__select"
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value)}
                    >
                        <option value="all">{messages.watchFilterAll || 'All'}</option>
                        <option value="open">{messages.watchFilterOpen || 'Open'}</option>
                        <option value="coop">{messages.watchFilterCoop || 'CoOps'}</option>
                        <option value="closed">{messages.watchFilterClosed || 'Closed'}</option>
                    </select>
                </div>
                <div className="watch-filters__field">
                    <label htmlFor="watch-sizes-filter">{messages.watchFilterSizes || 'Sizes'}</label>
                    <select
                        id="watch-sizes-filter"
                        className="watch-filters__select"
                        value={variantFilter}
                        onChange={(event) => setVariantFilter(event.target.value)}
                    >
                        <option value="all">{messages.watchFilterAll || 'All'}</option>
                        <option value="3x3">3x3</option>
                        <option value="2x3">2x3</option>
                    </select>
                </div>
            </div>
            {filteredGames.length > 0 ? (
                <ul id="live-games-list" className="live-games-list">
                    {filteredGames.map((game) => (
                        <WatchGameCard
                            key={game.game_id}
                            game={game}
                            difficultyLabels={difficultyLabels}
                            pendingJoinGameId={pendingJoinGameId}
                            onJoinGame={onJoinGame}
                            onWatchGame={onWatchGame}
                            messages={messages}
                        />
                    ))}
                </ul>
            ) : (
                <div id="live-games-list" className="live-games-list">
                    {liveGames.length === 0 ? (
                        <div className="watch-empty">
                            <p className="live-game-card__meta">
                                {canReconnect
                                    ? (messages.watchServerDisconnected || 'Not connected to the live server right now.')
                                    : messages.watchEmpty}
                            </p>
                            <p className="watch-empty__sub">
                                {messages.watchEmptySub}
                            </p>
                        </div>
                    ) : (
                        <div className="watch-empty">
                            <p className="live-game-card__meta">
                                {messages.watchNoMatches || 'No matching live games.'}
                            </p>
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    className="watch-box__refresh-btn"
                                    onClick={clearFilters}
                                >
                                    {messages.watchClearFilters || 'Clear filters'}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
