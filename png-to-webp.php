<?php
/*
Plugin Name: Image Converter Pro
Plugin URI: https://mrs-dev.com
Description: Konvertiert PNG, JPG und WEBP Bilder im Browser – mit Optionen für Format, Größe und Qualität.
Version: 1.3
Author: Raeed
Author URI: https://mrs-dev.com
License: GPL2
*/

if (!defined('ABSPATH')) exit;

// Scripts
function ptw_enqueue_scripts() {
    wp_enqueue_style('ptw-style', plugin_dir_url(__FILE__) . 'assets/style.css');
    wp_enqueue_script('ptw-script', plugin_dir_url(__FILE__) . 'assets/converter.js', array(), '1.3', true);
}
add_action('wp_enqueue_scripts', 'ptw_enqueue_scripts');

// Shortcode [image_converter]
function ptw_display_converter() {
    ob_start(); ?>
    <div class="ptw-container">
        <h2>🖼️ Image Converter Pro</h2>
        <p>Wandle deine Bilder direkt im Browser um – wähle Format, Größe und Qualität.</p>

        <div id="ptw-dropzone" class="ptw-dropzone">
            <p>📤 Dateien hierher ziehen oder auswählen</p>
            <input type="file" id="ptw-input" accept="image/*" multiple>
        </div>

        <div class="ptw-options">
            <label>🔄 Zielformat:</label>
            <select id="ptw-format">
                <option value="webp" selected>WEBP</option>
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
            </select>

            <label>📏 Größe:</label>
            <input type="number" id="ptw-width" placeholder="Breite (px)" min="1" style="width:100px;">
            <input type="number" id="ptw-height" placeholder="Höhe (px)" min="1" style="width:100px;">

            <label>🎚️ Qualität:</label>
            <input type="range" id="ptw-quality" min="0.1" max="1" step="0.1" value="0.9">
            <span id="ptw-quality-value">0.9</span>
        </div>

        <div id="ptw-preview"></div>
        <div id="ptw-results"></div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('image_converter', 'ptw_display_converter');

// Admin-Seite laden
require_once plugin_dir_path(__FILE__) . 'admin/png-to-webp-admin.php';
