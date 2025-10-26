<?php
/*
Plugin Name: PNG to WEBP Converter
Plugin URI: https://mrs-dev.com
Description: Modernes Tool mit Drag & Drop und Fortschrittsanzeige zum Umwandeln von PNG in WEBP.
Version: 1.1
Author: Raeed
Author URI: https://mrs-dev.com
License: GPL2
*/

if (!defined('ABSPATH')) exit;

// Styles & Scripts laden
function ptw_enqueue_scripts() {
    wp_enqueue_style('ptw-style', plugin_dir_url(__FILE__) . 'assets/style.css');
    wp_enqueue_script('ptw-script', plugin_dir_url(__FILE__) . 'assets/converter.js', array(), '1.1', true);
}
add_action('wp_enqueue_scripts', 'ptw_enqueue_scripts');

// Shortcode für Frontend
function ptw_display_converter() {
    ob_start(); ?>
    <div class="ptw-container">
        <h2>🖼️ PNG → WEBP Converter</h2>
        <p>Ziehe deine PNG-Bilder hierher oder wähle sie aus:</p>

        <div id="ptw-dropzone" class="ptw-dropzone">
            <p>📤 Drop your PNG files here</p>
            <input type="file" id="ptw-input" accept="image/png" multiple>
        </div>

        <div id="ptw-preview"></div>
        <div id="ptw-results"></div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('png_to_webp', 'ptw_display_converter');
