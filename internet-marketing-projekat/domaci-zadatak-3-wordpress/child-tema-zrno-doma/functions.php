<?php
/**
 * Zrno Doma Child - functions.php
 *
 * Child tema za internet prodavnicu "Zrno Doma" (Domaći zadatak 3).
 * Bazirana na roditeljskoj temi Storefront.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Zabranjen direktan pristup fajlu.
}

/**
 * Učitavanje CSS-a roditeljske i dete teme.
 * Roditeljski stylesheet se učitava prvi, pa child stylesheet koji ga
 * nadjačava - ovo je standardni, preporučeni WordPress pristup za child teme.
 */
function zrno_doma_child_enqueue_styles() {
    $parent_style = 'storefront-style'; // handle roditeljske teme (Storefront)

    wp_enqueue_style(
        $parent_style,
        get_template_directory_uri() . '/style.css'
    );

    wp_enqueue_style(
        'zrno-doma-child-style',
        get_stylesheet_directory_uri() . '/style.css',
        array( $parent_style ),
        wp_get_theme()->get( 'Version' )
    );
}
add_action( 'wp_enqueue_scripts', 'zrno_doma_child_enqueue_styles' );

/**
 * Zahtev 5 (korisničke uloge): kreiranje prilagođene uloge "Urednik sadržaja"
 * za člana tima zaduženog za blog/digitalni sadržaj (Zadatak 1), sa pravima
 * uređivanja objava ali bez administratorskih privilegija.
 * Pokreće se jednom (pri aktivaciji), ne na svakom učitavanju stranice.
 */
function zrno_doma_child_setup_role() {
    if ( ! get_role( 'urednik_sadrzaja' ) ) {
        add_role(
            'urednik_sadrzaja',
            'Urednik sadržaja',
            array(
                'read'                   => true,
                'edit_posts'             => true,
                'edit_published_posts'   => true,
                'publish_posts'          => true,
                'upload_files'           => true,
                'edit_product'           => true,
                'read_product'           => true,
            )
        );
    }
}
add_action( 'after_switch_theme', 'zrno_doma_child_setup_role' );

/**
 * Zahtev 4 (chatbot): mesto za umetanje skripte chatbot provajdera (npr.
 * Tidio) ukoliko se ne koristi zvanični plugin, već ručna integracija koda.
 * Ako se koristi Tidio plugin za WordPress, ovaj kod NIJE potreban - plugin
 * sam ubacuje skriptu. Ostavljeno je kao rezervni/alternativni način.
 */
function zrno_doma_child_chatbot_script() {
    // Primer: <script src="//code.tidio.co/XXXXXXXXXXXX.js" async></script>
    // Zameniti XXXXXXXXXXXX stvarnim Tidio public key-em tima nakon registracije
    // naloga na tidio.com, ili ukloniti ovu funkciju ako se koristi zvanični
    // Tidio WordPress plugin (preporučeno - jednostavnije za administraciju).
}
add_action( 'wp_footer', 'zrno_doma_child_chatbot_script' );

/**
 * Zahtev 7 (upsell/cross-sell): osigurava da se sekcija povezanih proizvoda
 * ("related products") prikazuje i na mobilnim prikazima proizvoda, jer je
 * neke teme po difoltu sakriju na užim ekranima.
 */
function zrno_doma_child_related_products_args( $args ) {
    $args['posts_per_page'] = 4;
    $args['columns']        = 4;
    return $args;
}
add_filter( 'woocommerce_output_related_products_args', 'zrno_doma_child_related_products_args' );
