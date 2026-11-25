import React from 'react';
import enMessages from '../locales/en.json';
import { IconArrowLeft } from './AppIcons.jsx';

function renderLegalContent(isPrivacy, isGerman) {
    if (isPrivacy) return (
                    isGerman ? (
                        <>
                            <h1 id="legal-page-title" className="legal-card__title">
                                Datenschutzerklärung (Privacy Policy)
                            </h1>
                            <p className="legal-card__meta">
                                Informationen gemäß Art. 13 DSGVO, DSG und § 165 Abs. 3 TKG 2021 für die Web-App <strong>sudoku.fraha.dev</strong> sowie die iOS-App <strong>Sudoku Shift</strong> (Stand: 14. November 2026).
                            </p>

                            <section className="legal-card__section">
                                <h2>1. Verantwortlicher (Art. 13 Abs. 1 lit. a &amp; b DSGVO)</h2>
                                <p>
                                    Franz Haberfellner
                                    <br />
                                    4481 Asten, Österreich
                                    <br />
                                    E-Mail: <a href="mailto:haf68k@gmail.com">haf68k@gmail.com</a>
                                </p>
                                <p>
                                    Ein Datenschutzbeauftragter ist gesetzlich nicht erforderlich (Art. 37 DSGVO) und daher nicht bestellt.
                                </p>
                            </section>

                            <section className="legal-card__section">
                                <h2>2. Grundsatz: Keine Konten, kein Tracking, keine Cookies</h2>
                                <p>
                                    Sudoku Shift erfordert kein Benutzerkonto, erstellt keine Nutzerprofile und verwendet keine Analyse-Dienste, keine Werbe-SDKs und <strong>keine Cookies</strong>.
                                </p>
                            </section>

                            <section className="legal-card__section">
                                <h2>3. Lokale Speicherung auf deinem Endgerät (§ 165 Abs. 3 TKG 2021)</h2>
                                <p>
                                    Zur Bereitstellung der von dir ausdrücklich gewünschten Spielfunktionen speichert die App ausschließlich technisch <strong>unbedingt erforderliche</strong> Daten lokal in deinem Browser bzw. auf deinem Gerät (Ausnahme von der Einwilligungspflicht gemäß § 165 Abs. 3 Satz 3 TKG 2021; Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO zur Bereitstellung des Dienstes bzw. Art. 6 Abs. 1 lit. f DSGVO – berechtigtes Interesse an einem funktionsfähigen Betrieb):
                                </p>
                                <ul>
                                    <li>
                                        <code>localStorage</code>: Darstellungsmodus, Sprache, Schwierigkeitsgrad, Variante, Audio-Einstellungen, Beitritts-Richtlinie sowie dein laufender Solo-Spielstand. <strong>Speicherdauer:</strong> bis zur Löschung durch dich in den Browser-/Geräteeinstellungen oder Deinstallation der App.
                                    </li>
                                    <li>
                                        <code>sessionStorage</code>: eine zufällige, sitzungsbezogene Client-ID, deine Raumrolle sowie ein temporärer Online-Spielstand. <strong>Speicherdauer:</strong> wird beim Schließen des Browser-Tabs bzw. Beenden der Sitzung gelöscht.
                                    </li>
                                </ul>
                            </section>

                            <section className="legal-card__section">
                                <h2>4. Echtzeit-Mehrspieler &amp; Zuschauermodus</h2>
                                <p>
                                    Wenn du ein Online-Spiel startest, einem Raum beitrittst oder einer Live-Partie zusiehst, werden Spielzüge, Notizen, Hinweise, Cursor-Positionen und Reaktionen in Echtzeit über unseren selbstgehosteten WebSocket-Server (<code>wss://sudoku-ws.fraha.dev</code>) an die Teilnehmenden des jeweiligen Raums übertragen (Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO).
                                </p>
                                <p>
                                    <strong>Speicherdauer:</strong> Diese Spieldaten existieren rein flüchtig im Arbeitsspeicher für die Dauer der aktiven Spielsitzung und werden nicht dauerhaft in einer Benutzerdatenbank gespeichert.
                                </p>
                            </section>

                            <section className="legal-card__section">
                                <h2>5. Server-, Verbindungsdaten, Empfänger &amp; Drittlandtransfer</h2>
                                <p>
                                    Beim Aufruf der Website oder beim Aufbau einer WebSocket-Verbindung werden technisch erforderliche Verbindungsdaten (insbesondere IP-Adresse, Zeitstempel, angeforderter Pfad und TLS-/Browser-Metadaten) verarbeitet, um die Verbindung auszuliefern, die Netz- und Informationssicherheit zu gewährleisten und Missbrauch bzw. DDoS-Angriffe abzuwehren (Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO – berechtigtes Interesse am sicheren und stabilen Betrieb).
                                </p>
                                <p>
                                    <strong>Empfänger &amp; Drittlandübermittlung (Art. 13 Abs. 1 lit. e &amp; f DSGVO):</strong> Die Auslieferung und Absicherung erfolgt über unsere Server-Infrastruktur sowie über <strong>Cloudflare</strong> (Cloudflare, Inc., USA / Cloudflare Germany GmbH) als Tunnel-, CDN- und Sicherheitsdienstleister. Dabei können technische Verbindungsdaten auch in die USA übermittelt werden. Cloudflare ist nach dem <strong>EU-US Data Privacy Framework (DPF)</strong> zertifiziert (Angemessenheitsbeschluss nach Art. 45 DSGVO); ergänzend bestehen Standardvertragsklauseln gemäß Art. 46 DSGVO. Server- und Sicherheitslogs werden nur so lange aufbewahrt, wie es technisch für Betrieb und Sicherheit erforderlich ist.
                                </p>
                                <p>
                                    <strong>Externer App-Store-Link (nur Web, sofern aktiv):</strong> Sofern auf der Web-Startseite ein Link in den Apple App Store angezeigt wird, wird erst beim aktiven Anklicken dieses Links eine Verbindung zu Servern der Apple Distribution International Ltd. hergestellt; ab diesem Zeitpunkt gelten die Datenschutzbestimmungen von Apple.
                                </p>
                            </section>

                            <section className="legal-card__section">
                                <h2>6. Bereitstellungspflicht &amp; automatisierte Entscheidungsfindung</h2>
                                <p>
                                    Die Bereitstellung personenbezogener Daten ist weder gesetzlich noch vertraglich vorgeschrieben. Ohne technisch erforderliche Verbindungs- bzw. WebSocket-Daten ist ein Abruf der Website bzw. die Nutzung des Online- und Zuschauermodus technisch nicht möglich (der Solo-Modus funktioniert nach dem Laden lokal). Eine automatisierte Entscheidungsfindung einschließlich Profiling gemäß Art. 22 DSGVO findet nicht statt.
                                </p>
                            </section>

                            <section className="legal-card__section">
                                <h2>7. Deine Rechte &amp; Beschwerderecht (DSGVO / DSG)</h2>
                                <p>
                                    Dir stehen nach der DSGVO grundsätzlich die Rechte auf <strong>Auskunft</strong> (Art. 15), <strong>Berichtigung</strong> (Art. 16), <strong>Löschung</strong> (Art. 17), <strong>Einschränkung der Verarbeitung</strong> (Art. 18), <strong>Datenübertragbarkeit</strong> (Art. 20) sowie <strong>Widerspruch</strong> (Art. 21 DSGVO gegen Verarbeitungen auf Basis von Art. 6 Abs. 1 lit. f DSGVO) zu. Soweit eine Verarbeitung auf einer Einwilligung beruht, kannst du diese jederzeit mit Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3 DSGVO). Anfragen richte bitte an <a href="mailto:haf68k@gmail.com">haf68k@gmail.com</a>.
                                </p>
                                <p>
                                    <strong>Beschwerderecht bei der Aufsichtsbehörde (Art. 77 DSGVO, § 24 DSG):</strong> Wenn du glaubst, dass die Verarbeitung deiner Daten gegen das Datenschutzrecht verstößt, kannst du dich bei der zuständigen Aufsichtsbehörde beschweren. In Österreich ist dies die:
                                    <br />
                                    <strong>Österreichische Datenschutzbehörde (DSB)</strong>, Barichgasse 40–42, 1030 Wien, Österreich, Telefon: +43 1 52 152-0, E-Mail: <a href="mailto:dsb@dsb.gv.at">dsb@dsb.gv.at</a>, Website: <a href="https://www.dsb.gv.at" target="_blank" rel="noopener noreferrer">www.dsb.gv.at</a>.
                                </p>
                            </section>
                        </>
                    ) : (
                        <>
                            <h1 id="legal-page-title" className="legal-card__title">
                                Privacy Policy
                            </h1>
                            <p className="legal-card__meta">
                                Information pursuant to Art. 13 GDPR, the Austrian Data Protection Act (DSG), and § 165(3) Austrian Telecommunications Act (TKG 2021) for <strong>sudoku.fraha.dev</strong> and the iOS app <strong>Sudoku Shift</strong> (Effective: November 14, 2026).
                            </p>

                            <section className="legal-card__section">
                                <h2>1. Controller (Art. 13(1)(a) &amp; (b) GDPR)</h2>
                                <p>
                                    Franz Haberfellner
                                    <br />
                                    4481 Asten, Austria
                                    <br />
                                    Email: <a href="mailto:haf68k@gmail.com">haf68k@gmail.com</a>
                                </p>
                                <p>
                                    No Data Protection Officer is required by law (Art. 37 GDPR) and none has been appointed.
                                </p>
                            </section>

                            <section className="legal-card__section">
                                <h2>2. No Accounts, No Tracking &amp; No Cookies</h2>
                                <p>
                                    Sudoku Shift does not require an account, does not build user profiles, and does not use analytics services, advertising SDKs, or <strong>HTTP cookies</strong>.
                                </p>
                            </section>

                            <section className="legal-card__section">
                                <h2>3. Local Storage on Your Device (§ 165(3) TKG 2021)</h2>
                                <p>
                                    To deliver the functionality you explicitly request, the app stores only <strong>strictly necessary</strong> technical data locally on your device (exempt from consent under § 165(3) sentence 3 Austrian TKG 2021; legal basis: Art. 6(1)(b) GDPR for service delivery and Art. 6(1)(f) GDPR for legitimate interest in reliable operation):
                                </p>
                                <ul>
                                    <li>
                                        <code>localStorage</code>: theme, language, difficulty, variant, audio settings, join policy, and your ongoing solo puzzle state. <strong>Retention:</strong> stored locally until cleared by you in browser/device settings or by uninstalling the app.
                                    </li>
                                    <li>
                                        <code>sessionStorage</code>: a random session-scoped client ID, your room role, and a temporary online match snapshot. <strong>Retention:</strong> cleared automatically when you close the browser tab or end the session.
                                    </li>
                                </ul>
                            </section>

                            <section className="legal-card__section">
                                <h2>4. Real-Time Co-op &amp; Spectating</h2>
                                <p>
                                    When you start an online match, join a room, or spectate a live board, cell moves, notes, hints, cursor positions, and reactions are relayed in real time via our self-hosted WebSocket server (<code>wss://sudoku-ws.fraha.dev</code>) to participants in that room (legal basis: Art. 6(1)(b) GDPR).
                                </p>
                                <p>
                                    <strong>Retention:</strong> Match room data is kept purely ephemerally in server memory for the duration of the active session and is not persisted in a user database.
                                </p>
                            </section>

                            <section className="legal-card__section">
                                <h2>5. Connection Data, Recipients &amp; International Transfers</h2>
                                <p>
                                    When loading the web app or connecting to the WebSocket service, technically necessary connection metadata (such as IP address, timestamp, request path, and TLS/browser metadata) is processed to deliver the service, maintain network security, and prevent abuse or DDoS attacks (legal basis: Art. 6(1)(f) GDPR — legitimate interest in secure and stable operation).
                                </p>
                                <p>
                                    <strong>Recipients &amp; Third-Country Transfers (Art. 13(1)(e) &amp; (f) GDPR):</strong> Delivery and edge protection rely on our hosting infrastructure and <strong>Cloudflare</strong> (Cloudflare, Inc., USA / Cloudflare Germany GmbH) as a tunnel, CDN, and security provider. Technical connection metadata may be processed in the United States. Cloudflare is certified under the <strong>EU-US Data Privacy Framework (DPF)</strong> (European Commission adequacy decision under Art. 45 GDPR), supplemented by Standard Contractual Clauses under Art. 46 GDPR. Connection logs are retained only as long as technically required for security and operations.
                                </p>
                                <p>
                                    <strong>External App Store Link (Web only, when active):</strong> Where an outbound link to the Apple App Store is displayed on the web start screen, a connection to servers of Apple Distribution International Ltd. is only established if you actively click that link, at which point Apple&apos;s privacy policy applies.
                                </p>
                            </section>

                            <section className="legal-card__section">
                                <h2>6. Statutory/Contractual Requirement &amp; Automated Decision-Making</h2>
                                <p>
                                    Providing personal data is neither legally nor contractually required. However, without technically necessary connection and WebSocket transmission data, the website and online/spectator modes cannot function (solo play works locally once loaded). No automated decision-making or profiling within the meaning of Art. 22 GDPR takes place.
                                </p>
                            </section>

                            <section className="legal-card__section">
                                <h2>7. Your Rights &amp; Supervisory Authority (GDPR / Austrian DSG)</h2>
                                <p>
                                    Under the GDPR, you have the right to <strong>access</strong> (Art. 15), <strong>rectification</strong> (Art. 16), <strong>erasure</strong> (Art. 17), <strong>restriction of processing</strong> (Art. 18), <strong>data portability</strong> (Art. 20), and to <strong>object</strong> (Art. 21 GDPR) to processing based on Art. 6(1)(f) GDPR. Where processing is based on consent, you may withdraw consent at any time with future effect (Art. 7(3) GDPR). Contact: <a href="mailto:haf68k@gmail.com">haf68k@gmail.com</a>.
                                </p>
                                <p>
                                    <strong>Right to Lodge a Complaint (Art. 77 GDPR, § 24 DSG):</strong> You have the right to lodge a complaint with a supervisory authority if you believe processing violates data protection law. In Austria, the competent authority is the:
                                    <br />
                                    <strong>Austrian Data Protection Authority (Österreichische Datenschutzbehörde, DSB)</strong>, Barichgasse 40–42, 1030 Vienna, Austria, Phone: +43 1 52 152-0, Email: <a href="mailto:dsb@dsb.gv.at">dsb@dsb.gv.at</a>, Website: <a href="https://www.dsb.gv.at" target="_blank" rel="noopener noreferrer">www.dsb.gv.at</a>.
                                </p>
                            </section>
                        </>
                    )
                );
    return isGerman ? (
                    <>
                        <h1 id="legal-page-title" className="legal-card__title">
                            Impressum
                        </h1>
                        <p className="legal-card__meta">
                            Offenlegung gemäß § 25 Abs. 5 Mediengesetz (MedienG, Österreich) für eine rein private, nicht-kommerzielle Website
                        </p>

                        <section className="legal-card__section">
                            <h2>Medieninhaber &amp; Verantwortlicher</h2>
                            <p>
                                Franz Haberfellner
                                <br />
                                Wohnort: 4481 Asten, Österreich
                                <br />
                                E-Mail: <a href="mailto:haf68k@gmail.com">haf68k@gmail.com</a>
                                <br />
                                Website: <a href="https://sudoku.fraha.dev">https://sudoku.fraha.dev</a>
                            </p>
                        </section>

                        <section className="legal-card__section">
                            <h2>Art &amp; Zweck des Angebots</h2>
                            <p>
                                Dies ist ein privates, unentgeltliches und nicht-kommerzielles Webprojekt zur Bereitstellung von Sudoku Shift (ohne Gewinnerzielungsabsicht, ohne In-App-Käufe, ohne Werbung und ohne auf öffentliche Meinungsbildung gerichtete redaktionelle Inhalte; kein gewerblicher bzw. geschäftlicher Dienst im Sinne des § 5 E-Commerce-Gesetz – ECG).
                            </p>
                        </section>

                        <section className="legal-card__section">
                            <h2>Hinweis zu externen Links</h2>
                            <p>
                                Verweise auf externe Angebote (z. B. der Link zum Apple App Store auf der Web-Startseite) führen zu Inhalten Dritter, für die ausschließlich deren jeweilige Betreiber verantwortlich sind.
                            </p>
                        </section>
                    </>
                ) : (
                    <>
                        <h1 id="legal-page-title" className="legal-card__title">
                            Legal Notice (Impressum)
                        </h1>
                        <p className="legal-card__meta">
                            Disclosure pursuant to § 25(5) Austrian Media Act (Mediengesetz, MedienG) for a private, non-commercial website
                        </p>

                        <section className="legal-card__section">
                            <h2>Media Owner &amp; Responsible Contact</h2>
                            <p>
                                Franz Haberfellner
                                <br />
                                Place of residence: 4481 Asten, Austria
                                <br />
                                Email: <a href="mailto:haf68k@gmail.com">haf68k@gmail.com</a>
                                <br />
                                Website: <a href="https://sudoku.fraha.dev">https://sudoku.fraha.dev</a>
                            </p>
                        </section>

                        <section className="legal-card__section">
                            <h2>Project Scope</h2>
                            <p>
                                This is a private, free, non-commercial web project providing Sudoku Shift (operated without profit intent, without in-app purchases, without advertising, and without editorial content aimed at shaping public opinion; not a commercial information society service under § 5 Austrian E-Commerce Act – ECG).
                            </p>
                        </section>

                        <section className="legal-card__section">
                            <h2>External Links</h2>
                            <p>
                                Outbound links to external services (such as the Apple App Store link on the web start screen) point to third-party content for which the respective operators are solely responsible.
                            </p>
                        </section>
                    </>
                );
}

export function LegalPage({
    page,
    language = 'en',
    onBack,
    onSwitchPage,
    messages = enMessages,
}) {
    const isGerman = language === 'de';
    const isPrivacy = page === 'privacy';

    return (
        <main id={`legal-${page}`} className="legal-page split-layout" aria-labelledby="legal-page-title">
            <div className="legal-page__top-bar">
                <button
                    type="button"
                    id="legal-back-btn"
                    className="game-top-bar__back-btn"
                    onClick={onBack}
                >
                    <IconArrowLeft className="back-btn__icon" />
                    <span>{messages.legalBackToApp || 'Back to Sudoku Shift'}</span>
                </button>
                <a
                    id={isPrivacy ? 'legal-switch-impressum' : 'legal-switch-privacy'}
                    href={isPrivacy ? '/impressum' : '/privacy'}
                    className="legal-page__switch-link"
                    onClick={(e) => {
                        e.preventDefault();
                        onSwitchPage(isPrivacy ? 'impressum' : 'privacy');
                    }}
                >
                    {isPrivacy ? messages.impressumTitle : messages.privacyTitle}
                </a>
            </div>

            <article className="legal-card">
                {renderLegalContent(isPrivacy, isGerman)}
            </article>
        </main>
    );
}
