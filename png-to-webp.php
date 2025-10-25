<?php
/*
Plugin Name: PNG to WEBP Converter
Plugin URI: https://mrs-dev.com
Description: Wandelt PNG-Bilder direkt im Browser in WEBP um – schnell und DSGVO-sicher.
Version: 1.0
Author: Raeed
Author URI: https://mrs-dev.com
License: GPL2
*/

if (!defined('ABSPATH')) exit;

// Styles & Scripts laden
function ptw_enqueue_scripts() {
    wp_enqueue_style('ptw-style', plugin_dir_url(__FILE__) . 'assets/style.css');
    wp_enqueue_script('ptw-script', plugin_dir_url(__FILE__) . 'assets/converter.js', array(), '1.0', true);
}
add_action('wp_enqueue_scripts', 'ptw_enqueue_scripts');

// Shortcode für Frontend
function ptw_display_converter() {
    ob_start(); ?>
    <div class="ptw-container">
        <h2>🖼️ PNG → WEBP Converter</h2>
        <p>Wandle deine PNG-Bilder direkt in WEBP um – ohne Upload auf den Server!</p>

        <input type="file" id="ptw-input" accept="image/png" multiple>
        <div id="ptw-preview"></div>

        <div id="ptw-results"></div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('png_to_webp', 'ptw_display_converter');
