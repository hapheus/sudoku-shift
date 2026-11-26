import React from 'react';
import { getPlayerResults } from '../domain/game-contributions.js';
import { DialogCard } from './DialogCard.jsx';
import { NightGhostArtwork } from './LandscapeArtwork.jsx';
import { SolveSummary } from './SolveSummary.jsx';
import { SpectatorHintsFeed } from './SpectatorHintsFeed.jsx';
import { StatusBanner } from './StatusBanner.jsx';
import { SudokuBoard } from './SudokuBoard.jsx';
import { TicTacToeView } from './TicTacToeView.jsx';

export function GamePlayView({
    mainAriaLabel,
    topBar,
    landscapeLayout = false,
    guide = null,
    showGameInfo = false,
    onCloseGameInfo,
    gameInfoOpenerRef,
    notices = null,
    connectionStatus,
    mode,
    isSpectating,
    myRole,
    myClientId,
    currentMembers,
    spectatedGameMode,
    gameState,
    elapsedSeconds = null,
    ticTacToeGame = null,
    onTicTacToeMove = () => {},
    onReconnect,
    onContinueSolo = null,
    selectedIndex,
    activeDigit,
    hintsByCell,
    floatingReactions,
    cellRefs,
    onCellSelect,
    playerCursorIndex,
    partnerCursorIndices,
    unitCelebration,
    hintHighlight,
    fistBump = null,
    nightGhost = null,
    dismissNightGhost,
    boardBackground,
    actionFeedback,
    isCoopSession,
    restartLabel,
    restartDisabled,
    onPlayAgain,
    onBackToSetup = null,
    activeBoardVariant,
    onSelectHint,
    onApplyHint,
    bottomControls,
    messages,
}) {
    const notifications = <>{notices}{actionFeedback && (
        <div id="action-feedback" className="action-feedback" role="status">{actionFeedback}</div>
    )}</>;
    const displayElapsedSeconds = elapsedSeconds ?? gameState.elapsedSeconds ?? 0;
    const status = (
        <StatusBanner
            connectionStatus={connectionStatus}
            mode={mode}
            isSpectating={isSpectating}
            myRole={myRole}
            myClientId={myClientId}
            currentMembers={currentMembers}
            spectatedGameMode={spectatedGameMode}
            gameState={gameState}
            elapsedSeconds={displayElapsedSeconds}
            onReconnect={onReconnect}
            onContinueSolo={onContinueSolo}
            messages={messages}
        />
    );
    const info = showGameInfo && (
        <DialogCard
            id="game-info-dialog"
            title={messages.gameInfoTitle}
            closeLabel={messages.closeLabel}
            onClose={onCloseGameInfo}
            panel={landscapeLayout}
            returnFocusRef={gameInfoOpenerRef}
        >
            {status}
        </DialogCard>
    );
    const controlsPanel = landscapeLayout && info ? info : guide;
    const playerResults = gameState.status === 'solved' ? getPlayerResults(gameState, currentMembers) : [];
    const multiplayerResult = isCoopSession || gameState.wasMultiplayer || (isSpectating && spectatedGameMode === 'online');
    const toolbar = (
        <div className="gameplay-stage__toolbar">
            {topBar}
        </div>
    );
    return (
        <main
            className="game-screen"
            aria-label={mainAriaLabel}
            onPointerDownCapture={nightGhost ? dismissNightGhost : undefined}
            onKeyDownCapture={nightGhost ? dismissNightGhost : undefined}
        >
            <h1 className="sr-only">{mainAriaLabel}</h1>
            {landscapeLayout && toolbar}

            <div className="gameplay-stage split-panes">
                <div className="gameplay-stage__board">
                    <div className="gameplay-stage__board-content">
                        {ticTacToeGame && ticTacToeGame.phase !== 'transition' ? (
                            <TicTacToeView
                                game={ticTacToeGame}
                                playerId={myClientId}
                                isSpectating={isSpectating}
                                onMove={onTicTacToeMove}
                                messages={messages}
                            />
                        ) : (
                            <div className={ticTacToeGame?.phase === 'transition' ? 'tic-tac-toe-transition-stage tic-tac-toe-transition-stage--active' : 'tic-tac-toe-transition-stage'}>
                                <SudokuBoard
                                    gameState={gameState}
                                    selectedIndex={selectedIndex}
                                    activeDigit={activeDigit}
                                    hintsByCell={hintsByCell}
                                    floatingReactions={floatingReactions}
                                    cellRefs={cellRefs}
                                    onCellSelect={onCellSelect}
                                    myRole={myRole}
                                    playerCursorIndex={playerCursorIndex}
                                    partnerCursorIndices={partnerCursorIndices}
                                    unitCelebration={unitCelebration}
                                    hintHighlight={hintHighlight}
                                    fistBump={fistBump}
                                    nightGhost={nightGhost}
                                    boardBackground={boardBackground}
                                    messages={messages}
                                />
                                {ticTacToeGame?.phase === 'transition' && (
                                    <div className="tic-tac-toe-transition" role="status" aria-live="polite">
                                        <p className="tic-tac-toe-transition__text">
                                            {messages?.ticTacToeTransition || "You undo me. I undo you. Let's settle this."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="gameplay-stage__controls">
                    <div className="gameplay-stage__controls-content">
                        {!controlsPanel && notifications}
                        {controlsPanel ? <div className="gameplay-stage__guide">{notifications}{controlsPanel}</div> : <div className="gameplay-stage__side">

                            {gameState.status === 'solved' ? (
                                <SolveSummary
                                    difficulty={gameState.difficulty}
                                    elapsedSeconds={displayElapsedSeconds}
                                    mode={multiplayerResult ? 'online' : 'solo'}
                                    playerResults={playerResults}
                                    isSpectating={isSpectating}
                                    restartLabel={restartLabel}
                                    restartDisabled={restartDisabled}
                                    onPlayAgain={onPlayAgain}
                                    onBackToSetup={onBackToSetup}
                                    messages={messages}
                                />
                            ) : (
                                <>
                                    <SpectatorHintsFeed
                                        hintsByCell={hintsByCell}
                                        variant={activeBoardVariant}
                                        canApply={!isSpectating}
                                        onSelectHint={onSelectHint}
                                        onApplyHint={onApplyHint}
                                        messages={messages}
                                    />

                                    {bottomControls}
                                </>
                            )}
                        </div>}
                    </div>
                    {!landscapeLayout && toolbar}
                    {!landscapeLayout && <NightGhostArtwork nightGhost={nightGhost} side="bottom" />}
                </div>
            </div>
            {!landscapeLayout && info}
        </main>
    );
}
