<?php
if (!defined('ABSPATH')) exit;

// Admin-Menü hinzufügen
add_action('admin_menu', 'ptw_add_admin_menu');

function ptw_add_admin_menu() {
    add_menu_page(
        'PNG to WEBP',                 // Titel der Seite
        'PNG to WEBP',                 // Menü-Name
        'manage_options',              // Berechtigung
        'png-to-webp-admin',           // Slug
        'ptw_admin_page_content',      // Callback-Funktion
        'dashicons-format-image',      // Icon
        26                             // Position im Menü
    );
}

// Inhalt der Admin-Seite
function ptw_admin_page_content() {
    ?>
    <div class="wrap">
        <h1>🖼️ PNG → WEBP Converter</h1>
        <p>Dieses Tool konvertiert PNG-Bilder in das moderne WEBP-Format – direkt im Browser, DSGVO-konform.</p>

        <hr>
        <h2>🔧 Einstellungen (Demnächst)</h2>
        <p>Hier kannst du später Standardwerte wie Qualität, max. Dateigröße oder Designoptionen festlegen.</p>

        <hr>
        <h2>📢 Info / Werbung</h2>
        <div style="padding:15px; background:#f1f1f1; border-radius:8px; max-width:600px;">
            <strong>Tipp:</strong> Teste auch dein <a href="https://mrs-dev.com/tools/qr-generator" target="_blank">QR Generator Tool</a> 🚀  
            <br><br>
            <em>Bald verfügbar: PDF Converter & Text Compressor</em>
        </div>
    </div>
    <?php
}
