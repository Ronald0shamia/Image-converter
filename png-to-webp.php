<?php
/*
Plugin Name: Image Converter Pro
Plugin URI: https://mrs-dev.com
Description: Konvertiert PNG, JPG und WEBP Bilder direkt im Browser - mit Format-, Groessen- und Qualitaetswahl plus Vorher/Nachher-Vergleich.
Version: 1.4
Author: Raeed
Author URI: https://mrs-dev.com
License: GPL2
*/

if (!defined('ABSPATH')) exit;

// Scripts
function ptw_enqueue_scripts() {
    wp_enqueue_style('ptw-style', plugin_dir_url(__FILE__) . 'assets/style.css', array(), '1.4');
    wp_enqueue_script('ptw-script', plugin_dir_url(__FILE__) . 'assets/converter.js', array(), '1.4', true);
}
add_action('wp_enqueue_scripts', 'ptw_enqueue_scripts');

// Shortcode [image_converter]
function ptw_display_converter() {
    ob_start(); ?>
    <div class="ptw-container">
        <div class="ptw-header">
            <span class="ptw-kicker">Browser Tool</span>
            <h2>Image Converter Pro</h2>
            <p>Wandle Bilder lokal im Browser um und vergleiche Original und optimierte Version sofort.</p>
        </div>

        <div id="ptw-dropzone" class="ptw-dropzone">
            <div class="ptw-dropzone-icon" aria-hidden="true">+</div>
            <p>Dateien hierher ziehen oder auswaehlen</p>
            <span>PNG, JPG, JPEG und WEBP werden unterstuetzt.</span>
            <input type="file" id="ptw-input" accept="image/*" multiple aria-label="Bilder auswaehlen">
        </div>

        <div class="ptw-options" aria-label="Konvertierungsoptionen">
            <div class="ptw-field">
                <label for="ptw-format">Zielformat</label>
                <select id="ptw-format">
                    <option value="webp" selected>WEBP</option>
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                </select>
            </div>

            <div class="ptw-field">
                <label for="ptw-width">Breite</label>
                <input type="number" id="ptw-width" placeholder="Auto" min="1">
            </div>

            <div class="ptw-field">
                <label for="ptw-height">Hoehe</label>
                <input type="number" id="ptw-height" placeholder="Auto" min="1">
            </div>

            <label class="ptw-checkbox">
                <input type="checkbox" id="ptw-keep-ratio" checked>
                <span>Seitenverhaeltnis halten</span>
            </label>

            <div class="ptw-field ptw-field-quality">
                <label for="ptw-quality">Qualitaet <span id="ptw-quality-value">90%</span></label>
                <input type="range" id="ptw-quality" min="0.1" max="1" step="0.1" value="0.9">
            </div>
        </div>

        <div id="ptw-results" class="ptw-results" aria-live="polite"></div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('image_converter', 'ptw_display_converter');

// Admin-Seite laden
require_once plugin_dir_path(__FILE__) . 'admin/png-to-webp-admin.php';
