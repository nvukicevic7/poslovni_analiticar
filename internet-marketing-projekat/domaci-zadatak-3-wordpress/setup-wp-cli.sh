#!/usr/bin/env bash
#
# setup-wp-cli.sh — automatizacija Domaćeg zadatka 3 ("Zrno Doma") preko WP-CLI.
#
# ŠTA OVO RADI:
#   Aktivira child temu, instalira potrebne plugin-ove, podešava WooCommerce,
#   kreira kategorije, korisnike sa različitim ulogama, proizvode sa
#   upsell/cross-sell vezama i jedan kupon. Pokriva zahteve 2, 5, 6, 7 i deo 3, 8.
#
# ŠTA OVO NE RADI (ne može se WP-CLI-jem, mora ručno u browseru):
#   - Tidio nalog i unos baze znanja chatbota (zahtev 4) — treba OAuth/browser.
#   - Upload stvarnih slika proizvoda (generisanih po prompt-ovima iz Zadatka 1).
#   - Screenshotovi kao dokaz izvršenja.
#   - 20 test porudžbina (mogu se dodati sličnim wp-cli pristupom po želji,
#     ali ostavljeno je ručno jer treba realno variranje datuma/proizvoda).
#
# PREDUSLOVI:
#   1. WordPress već instaliran na hostingu, sa bazom i osnovnim podešavanjima.
#   2. SSH/terminal pristup hostingu i instaliran WP-CLI (`wp --info` radi).
#      Mnogi hostinzi (npr. lokalni Local by Flywheel, DigitalOcean droplet sa
#      WP-CLI, itd.) ovo već imaju.
#   3. Child tema iz foldera `child-tema-zrno-doma/` uploadovana u
#      wp-content/themes/zrno-doma-child (preko FTP/File Manager-a ili
#      `wp theme install <put-do-zip-a> --activate` ako je spakovana u zip).
#
# KAKO SE POKREĆE:
#   cd /putanja/do/wordpress/instalacije
#   bash setup-wp-cli.sh
#
# Ako WP-CLI komande treba da se pozivaju sa druge putanje, dodati --path=
# svakoj komandi ili izvoz WP_CLI_CONFIG_PATH / promenu radnog direktorijuma.
#
# NAPOMENA: ova skripta NIJE testirana na živom serveru (u ovom razvojnom
# okruženju nije bilo moguće podići pravi WordPress zbog mrežnih ograničenja
# sandbox-a). Sintaksa `wp wc ...` komandi odgovara zvaničnoj WooCommerce
# WP-CLI dokumentaciji, ali je moguće da će, u zavisnosti od verzije
# WordPress-a/WooCommerce/WP-CLI-ja na vašem hostingu, trebati sitne izmene.
# Pre pokretanja cele skripte, isprobajte jednu komandu ručno (npr.
# `wp wc product_cat create --name="Test" --user=admin_zrnodoma --porcelain`)
# i proverite dostupne opcije sa `wp wc product create --help`.
# Preporuka: prvo pokrenuti na test/staging okruženju, ne na produkciji.

set -e

# ---- Podešavanja — prilagoditi pre pokretanja -----------------------------
ADMIN_USER="admin_zrnodoma"          # postojeći administratorski nalog (mora već postojati)
NOVA_LOZINKA_MENADZER="PromeniMe!1"  # OBAVEZNO promeniti pre pokretanja
NOVA_LOZINKA_UREDNIK="PromeniMe!2"   # OBAVEZNO promeniti pre pokretanja
# -----------------------------------------------------------------------

echo "== 1/7: Aktivacija child teme (zahtev 2) =="
wp theme activate zrno-doma-child

echo "== 2/7: Instalacija i aktivacija plugin-ova =="
wp plugin install woocommerce --activate || echo "WooCommerce već instaliran/aktivan"
wp plugin install wordpress-seo --activate || echo "Yoast SEO već instaliran/aktivan"
wp plugin install tidio-live-chat --activate || echo "Tidio plugin već instaliran/aktivan (nalog i baza znanja se podešavaju ručno u browseru)"
wp plugin install addtoany --activate || echo "AddToAny (deljenje na društvenim mrežama) već instaliran/aktivan"

echo "== 3/7: Osnovna podešavanja WooCommerce (RSD, Srbija) =="
wp option update woocommerce_currency "RSD"
wp option update woocommerce_default_country "RS"
wp option update woocommerce_allowed_countries "specific"
wp option update woocommerce_specific_allowed_countries '["RS"]' --format=json

echo "== 4/7: Permalinks (čitljivi URL-ovi, pomaže SEO-u — zahtev 3) =="
wp rewrite structure '/%postname%/' --hard

echo "== 5/7: Kategorije proizvoda =="
CAT_KAFA_ID=$(wp wc product_cat create --name="Kafa i zrna" --user="$ADMIN_USER" --porcelain)
CAT_OPREMA_ID=$(wp wc product_cat create --name="Oprema za pripremu" --user="$ADMIN_USER" --porcelain)
echo "Kategorija 'Kafa i zrna' ID: $CAT_KAFA_ID"
echo "Kategorija 'Oprema za pripremu' ID: $CAT_OPREMA_ID"

echo "== 6/7: Korisnici sa različitim ulogama (zahtev 5) =="
# Prilagođena uloga "urednik_sadrzaja" dolazi iz child teme (functions.php);
# registrujemo je ovde eksplicitno i za slučaj da tema nije aktivirana preko
# switch_theme hook-a (npr. već je bila aktivna kada je hook trebalo da se pozove).
wp eval 'if ( ! get_role( "urednik_sadrzaja" ) ) { add_role( "urednik_sadrzaja", "Urednik sadržaja", array( "read" => true, "edit_posts" => true, "edit_published_posts" => true, "publish_posts" => true, "upload_files" => true ) ); }'

wp user create prodavnica_menadzer prodavnica@zrnodoma.rs \
  --role=shop_manager \
  --user_pass="$NOVA_LOZINKA_MENADZER" \
  --display_name="Prodavnica Menadžer" || echo "Korisnik prodavnica_menadzer već postoji"

wp user create urednik_sadrzaja urednik@zrnodoma.rs \
  --role=urednik_sadrzaja \
  --user_pass="$NOVA_LOZINKA_UREDNIK" \
  --display_name="Urednik Sadržaja" || echo "Korisnik urednik_sadrzaja već postoji"

echo "== 7/7: Proizvodi + upsell/cross-sell (zahtevi 6 i 7) =="
declare -A PRODUCT_IDS

create_product() {
  local sku="$1" name="$2" price="$3" cat_id="$4" desc="$5"
  local id
  id=$(wp wc product create \
    --name="$name" \
    --type=simple \
    --regular_price="$price" \
    --sku="$sku" \
    --description="$desc" \
    --categories="[{\"id\":$cat_id}]" \
    --user="$ADMIN_USER" \
    --porcelain)
  PRODUCT_IDS[$sku]=$id
  echo "  Kreiran proizvod '$name' (SKU $sku) -> ID $id"
}

create_product "ZD-KAFA-001" "Etiopija Yirgacheffe 250g" "1290" "$CAT_KAFA_ID" "Etiopija Yirgacheffe je specialty kafa svetlog pečenja iz istoimenog regiona, poznatog po cvetnim i citrusnim notama."
create_product "ZD-KAFA-002" "Brazil Santos 250g" "1190" "$CAT_KAFA_ID" "Brazil Santos je pitka i uravnotežena specialty kafa srednjeg pečenja, sa izraženim notama čokolade i lešnika."
create_product "ZD-KAFA-003" "Kolumbija Huila 250g" "1190" "$CAT_KAFA_ID" "Kolumbija Huila, tamnog pečenja, donosi puno telo i note tamne čokolade sa diskretnim dimljenim tonovima."
create_product "ZD-KAFA-004" "Probni paket - 3 pečenja" "1490" "$CAT_KAFA_ID" "Probni paket sadrži po 100g sva tri pečenja - idealan način da otkrijete svoj omiljeni profil ukusa."
create_product "ZD-OPR-001" "Ručni mlin za kafu" "3490" "$CAT_OPREMA_ID" "Ručni mlin sa keramičkim mehanizmom za precizno podešavanje krupnoće mlevenja."
create_product "ZD-OPR-002" "Hario V60 dripper set" "4290" "$CAT_OPREMA_ID" "Kompletan set za pour-over pripremu: keramički V60 dripper, filteri i digitalna vaga."
create_product "ZD-OPR-003" "Moka lonac 3 šolje" "2190" "$CAT_OPREMA_ID" "Klasični aluminijumski moka lonac za pripremu jake, aromatične kafe na italijanski način."

echo "-- Podešavanje upsell/cross-sell veza --"
wp wc product update "${PRODUCT_IDS[ZD-KAFA-001]}" --upsell_ids="[${PRODUCT_IDS[ZD-KAFA-004]}]" --cross_sell_ids="[${PRODUCT_IDS[ZD-OPR-002]},${PRODUCT_IDS[ZD-OPR-001]}]" --user="$ADMIN_USER"
wp wc product update "${PRODUCT_IDS[ZD-KAFA-002]}" --upsell_ids="[${PRODUCT_IDS[ZD-KAFA-004]}]" --cross_sell_ids="[${PRODUCT_IDS[ZD-OPR-003]},${PRODUCT_IDS[ZD-OPR-001]}]" --user="$ADMIN_USER"
wp wc product update "${PRODUCT_IDS[ZD-KAFA-003]}" --upsell_ids="[${PRODUCT_IDS[ZD-KAFA-004]}]" --cross_sell_ids="[${PRODUCT_IDS[ZD-OPR-001]},${PRODUCT_IDS[ZD-OPR-003]}]" --user="$ADMIN_USER"
wp wc product update "${PRODUCT_IDS[ZD-OPR-001]}" --cross_sell_ids="[${PRODUCT_IDS[ZD-KAFA-001]},${PRODUCT_IDS[ZD-KAFA-002]},${PRODUCT_IDS[ZD-KAFA-003]}]" --user="$ADMIN_USER"
wp wc product update "${PRODUCT_IDS[ZD-OPR-002]}" --cross_sell_ids="[${PRODUCT_IDS[ZD-KAFA-001]},${PRODUCT_IDS[ZD-OPR-001]}]" --user="$ADMIN_USER"
wp wc product update "${PRODUCT_IDS[ZD-OPR-003]}" --cross_sell_ids="[${PRODUCT_IDS[ZD-KAFA-002]},${PRODUCT_IDS[ZD-KAFA-003]}]" --user="$ADMIN_USER"

echo "-- Kupon (deo zahteva 8 - popusti) --"
wp wc shop_coupon create --code="PRVOZRNO10" --discount_type=percent --amount=10 --user="$ADMIN_USER" || echo "Kupon već postoji"

echo ""
echo "GOTOVO. Ručno preostaje:"
echo "  - Tidio nalog + unos baze znanja (chatbot-skripta-baza-znanja.md)"
echo "  - Upload slika proizvoda na svaki proizvod (Products -> Edit -> Product image)"
echo "  - Yoast SEO fokus ključne reči po stranici (seo-checklist.md)"
echo "  - 20 test porudžbina za analitiku (WooCommerce -> Orders -> Add order)"
echo "  - Plugin za napredno filtriranje/pretragu (po izboru tima)"
echo "  - Screenshotovi kao dokaz za svaki zahtev (vodic-izvrsenje-svih-zahteva.md)"
