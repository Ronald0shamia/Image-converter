<?php
if (!defined('ABSPATH')) exit;

// Admin-Menue hinzufuegen
add_action('admin_menu', 'ptw_add_admin_menu');

function ptw_add_admin_menu() {
    add_menu_page(
        'Image Converter Pro',
        'Image Converter Pro',
        'manage_options',
        'image-converter-pro',
        'ptw_admin_page_content',
        'dashicons-format-image',
        26
    );
}

// Inhalt der Admin-Seite
function ptw_admin_page_content() {
    ?>
    <div class="wrap">
        <h1>Image Converter Pro</h1>
        <p>Dieses Tool konvertiert Bilder direkt im Browser. Es werden keine Dateien auf den Server hochgeladen.</p>

        <hr>
        <h2>Einstellungen</h2>
        <p>Standardwerte wie Zielformat, Qualitaet, maximale Bildgroesse und Designoptionen koennen hier spaeter erweitert werden.</p>

        <hr>
        <h2>Shortcode</h2>
        <p>Fuege den Converter mit diesem Shortcode auf einer Seite oder in einem Beitrag ein:</p>
        <code>[image_converter]</code>

        <hr>
        <h2>Info</h2>
        <div style="padding:15px; background:#f6f7f7; border-left:4px solid #2271b1; max-width:640px;">
            <strong>Tipp:</strong> Teste auch dein <a href="https://mrs-dev.com/tools/qr-generator" target="_blank" rel="noopener noreferrer">QR Generator Tool</a>.
            <br><br>
            <em>Bald verfuegbar: PDF Converter und Text Compressor.</em>
        </div>
    </div>
    <?php
}
