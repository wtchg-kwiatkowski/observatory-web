DRAFT

TODO: resolve all intended-but-not-QA'd features (marked as `[ ]`), and answer all queries (marked as `??`)

Currently based on pre-milestone1 sub-versions:
- Panoptes core: observatory branch, commit ca669b7341f4150b0b7f9208235818f2a11e5289
- Observatory-web configuration: master branch, commit 90a4371084952d6e4316528e4e62de82b36ce2c8

___________________________________________

Quality Assured Features (QAFs)
===============================

Re: web application **MalariaGEN Analytics** milestone 1

Contents:
- About this document
- Compatibilities
- Features
- Components

____________________________________________

About this document
-------------------

### About the software
This document asserts the intended functionality and compatibility of features relating to the following software:

- **Name:** MalariaGEN Analytics
- **Type:** web application
- **Version:** milestone 1
- **Access Level:** anonymous users, i.e. `.*, .*, read` (Authorisation is controlled by the `server/responders/PanoptesAuthDb` file. Authentication is controlled by the `MalariaGEN SSO`.)

Summary:
- 434 quality-assured features
- 112 flawed features
- 110 related issues
- 489 user-interface components

### About the scope
Administrative features are considered out-of-scope for this document. (See the QAFs for the Panopte core software for that.)

### About the checkboxes
- [x] Checked items have been checked by a designated human, and found to be satisfactory.
- [ ] Unchecked items are supppose to work, but either they haven't been checked yet, or they have known issues. Known issues should be noted next to each unchecked item.

### About the "compatibilities" and "features"
To track bugs, features and other issues, please use the issue tracker in the associated [GitHub project](https://github.com/wtchg-kwiatkowski/observatory-web/issues).

### About the "components"
At the end of this document, there is a list of user-interface components. These are all the user-interface components that are referred to in the **Features** section, and they have been loosely organised into a sort of hierarchy.


Compatibilities
---------------

### Server operating systems:
- [x] Canonical Ubuntu Server 16.04.5 LTS (Xenial Xerus), 18.04.1 (Bionic Beaver)
- [x] Debian GNU/Linux 9.4 (stretch)

### Client machine specifications:
- Internet connection
  - [x] 26 Mbps download speed (UK average[^1])
  - [x] 11 Mbps upload speed (UK average[^1])
  - [x] 900 Mbps download speed
  - [x] 935 Mbps upload speed
- CPU
  - [x] 3.40GHz x 8
- RAM
  - [x] 15.6 GiB

[^1]: http://www.speedtest.net/reports/united-kingdom/ "Q3–Q4 2017"


### Client operating systems and web browsers:
- Desktop and laptop
  - Canonical Ubuntu 18.04.1 (Bionic Beaver)
    - [x] Google Chrome 69
    - [ ] Mozilla Firefox 62
  - Canonical Ubuntu 16.04.5 LTS (Xenial Xerus)
    - [x] Google Chrome 69
    - [ ] Mozilla Firefox 62
  - Microsoft Windows 10
    - [x] Google Chrome 69
    - [ ] Mozilla Firefox 62
    - [ ] Microsoft Edge 42
  - Apple macOS 10.12
    - [ ] Apple Safari v??
    - [ ] Google Chrome 69
    - [ ] Mozilla Firefox 62
- Tablet and mobile
  - Apple iOS 10
    - [ ] Apple Safari v??


____________________________________________

Features
--------

Variables:
- The _webapp's home address_ might be:
  - Local development: `http://localhost:8080/analytics`
  - Staging: `http://foo.bar/analytics`
  - Production: `https://www.malariagen.net/analytics`
- The _horizontal-menu break-point pixel-width_ is currently hard-coded to 1200 pixels via custom component file `page-template.scss`
- The _table-data page-rows-size_ is currently set to 250 rows via Panoptes core file `components/containers/DataTableWithActions.js` (default value, can be overridden)

Terminology:
- "button" is interchangeable with "link"
- "click" is interchangeable with the "tap" action on touch-screen devices

The use of a control implies that the control itself can be seen, and that the specified effect of its use also occurs. For example, "Click on the red button to see the green box" implies that a red button can be seen, and can be clicked on, and that clicking on that red button causes a green box to become visible. If the control cannot be seen, or clicked on, or if no green box becomes visible after clicking on it, then that feature is deemed to have failed QA (and the issue should be noted).

For the compatible platforms, the following features of the specified release have been verified.

As an end-user of the software, you can:

### From anywhere with a compatible internet connection
- [x] Visit the _webapp's home address_ using a compatible web browser to see the webapp's `home page` with no critical errors (e.g. 404)
  - [x] Click on the `cookies consent button` to hide the `cookie consent request`
  - [x] Don't see the `cookies consent request` after previously clicking on the `cookies consent button` and reloading the page with normal settings.
  - [x] Click on the `cookies statement button` to see the `cookies statement`

### From anywhere in the webapp
- [x] Click on the `MalariaGEN Analytics logo` to see the webapp's `home page`
- [x] If your viewport > _horizontal-menu break-point pixel-width_, see the `horizontal-menu buttons`
- For viewports < _horizontal-menu break-point pixel-width_:
  - [x] Click on the `hamburger-menu button` to see the `hamburger-menu buttons`
    - [x] Click on the `hamburger-menu home button` to see the `home page`
    - [x] Click on the `hamburger-menu articles button` to see the `articles page`
    - [x] Click on the `hamburger-menu analyses button` to see the `analyses page`
    - [x] Click on the `hamburger-menu data button` to see the `data page`
- For viewports >= _horizontal-menu break-point pixel-width_:
  - [x] Click on the `horizontal-menu home button` to see the `home page`
  - [x] Click on the `horizontal-menu articles button` to see the `articles page`
  - [x] Click on the `horizontal-menu home button` to see the `analyses page`
  - [x] Click on the `horizontal-menu home button` to see the `data page`
- [x] Except from the `home page`, see the `navigational breadcrumb`
  - [ ] Use the `navigational breadcrumb` to see your current position in the page hierarchy [Issue #296](https://github.com/wtchg-kwiatkowski/observatory-web/issues/296)
  - [x] Use the `navigational breadcrumb` to navigate to parent pages

### From the `home page`

#### Access `articles`
- [x] See the 3 most recent `articles`
  - For each `article`:
    - [x] See the `article title`
    - [x] See the `article author`
    - [x] See the `article date`
    - [x] See the `article excerpt`
    - [x] Click on the `read-more button` to see that `article page`
  - [x] If the `article` has a featured image, see the `article featured image`
- [x] Click on the `all articles button` to see the `articles page`

#### Access `analyses`
- [x] See a summary of the `analyses`
- [x] Click on the `antimalarial-drugs button` to see the `antimalarial-drugs page`
- [x] Click on the `geographical-regions button` to see the `geographical-regions page`
- [x] Click on the `antimalarial-drug-resistance genes button` to see the `antimalarial-drug-resistance genes page`
- [x] Click on the `resistance-map button` to see the `resistance-map page`

#### Access `data`
- [x] See a summary of the `data`
- [x] Click on the `samples-table button` to see the `samples-table page`
- [x] Click on the `variants-table button` to see the `variants-table page`
- [x] Click on the `genome-browser button` to see the `genome-browser page`

#### Access `information about MalariaGEN Analytics and its data`
- [x] See a summary of the `information about MalariaGEN Analytics and its data`
- [x] Click on the `about MalariaGEN Analytics button` to see the `about MalariaGEN Analytics page`

#### Access `scientific publications and technical reports`
- [x] See a summary of the `scientific publications and technical reports`
- [x] Click on the `scientific publications and technical reports button` to see the `scientific publications and technical reports page`

### From the `articles page`
- [ ] Toggle the `article category checkboxes` to see only the `articles` that are in the checked `article categories` [Issue #288](https://github.com/wtchg-kwiatkowski/observatory-web/issues/288)
- For each `article`:
  - [x] See the `article title`
  - [x] See the `article author`
  - [x] See the `article date`
  - [x] See the `article excerpt`
  - [ ] See the `article categories` [Issue #288](https://github.com/wtchg-kwiatkowski/observatory-web/issues/288)
  - [x] Click on the `read-more button` to see that `article page`
- [x] See the `article featured image` for at least one `article`

### From an `article page`
- [x] See the `article title`
- [x] See the `article author`
- [x] See the `article date`
- [x] See the `article full-content`
  - [x] See `article featured image`
  - [x] See `article content with separated paragraphs`
  - [x] See `article content with larger and bolder headings`
  - [x] See `article content with italics where intended`
  - [x] See `article content with images where intended`
  - [ ] Click on any `internal link` to see the corresponding `internal page` [Issue #292](https://github.com/wtchg-kwiatkowski/observatory-web/issues/292)

### From the `analyses page`
- [x] See content that is consistent with the `home page`
- [x] See a summary of the `analyses`
- [x] Click on the `antimalarial-drugs button` to see the `antimalarial-drugs page`
- [x] Click on the `geographical-regions button` to see the `geographical-regions page`
- [x] Click on the `antimalarial-drug-resistance genes button` to see the `antimalarial-drug-resistance genes page`
- [x] Click on the `resistance-map button` to see the `resistance-map page`

### From the `data page`
- [x] See content that is consistent with the `home page`
- [x] See a summary of the `data`
- [x] Click on the `samples-table button` to see the `samples-table page`
- [x] Click on the `variants-table button` to see the `variants-table page`
- [x] Click on the `genome-browser button` to see the `genome-browser page`

### From the `about MalariaGEN Analytics page`
- [x] Click on the `about dataset button` to go to the `MalariaGEN website data page`
- [x] Click on the `about metrics button` to see the scientific publications and technical reports page`
- [ ] Click on the `about webapps button` to see the `?? page` [Issue #294](https://github.com/wtchg-kwiatkowski/observatory-web/issues/294)
- [x] Click on the `about MalariaGEN button` to go to the `MalariaGEN website home page`
- [x] Click on the `scientific publications and technical reports button` to see the `scientific publications and technical reports page`

### From the `scientific publications and technical reports page`
- [x] See the `navigational breadcrumb`
- [x] See the `page title`
- [x] See a summary of the `publications/reports`
- For each `publication/report`:
  - [ ] Click on the `publication/report button` to download the `publication/report file` [Issue #295](https://github.com/wtchg-kwiatkowski/observatory-web/issues/295)
- [x] See a summary of the `technical documents`
- For each `technical document`:
  - [x] Click on the `publication/report button` to download the `publication/report file`

### From the `antimalarial-drugs page`
- [x] See the `antimalarial-drugs that MalariaGEN Analytics predicts the resistance status for`
  - For each `antimalarial-drug`:
    - [x] See the `antimalarial-drug name`
    - [x] See the `antimalarial-drug short-description`
    - [x] Click on the `antimalarial-drug button` to see that `antimalarial-drug page`
- [x] See the `table of resistance status for the full list of antimalarial-drugs and the full list of geographic-regions`
  - For each combination of `antimalarial-drug` and `geographic-region`:
    - [x] See the `antimalarial-drug-resistance-status colour-gradated spot`
    - [x] If you have a `pointer`, see the `predicted percentage of antimalarial-drug-resistance in geographic-region tooltip` when you hover over the `antimalarial-drug-resistance-status colour-gradated spot`
    - [x] Click on the `antimalarial-drug-resistance-status colour-gradated spot` to see the `antimalarial-drug in geographic-region page`
  - [x] See the `legend for the antimalarial-drug-resistance-status colour-gradation`
- [x] Click on the `technical document about antimalarial-drug-resistance prediction button` to see the `technical document about antimalarial-drug-resistance prediction`

### From a `antimalarial-drug page`
- [x] See the `antimalarial-drug name`
- [x] See the `antimalarial-drug resistance description`
- For each `antimalarial-drug resistance gene` associated with the `antimalarial-drug`:
  - [x] Click on the `antimalarial-drug resistance gene button` to see the `antimalarial-drug-resistance gene page`
- [x] See a `geographic-map`
  - [x] See the `legend for the antimalarial-drug-resistance-status colour-gradation`
    - For each `geographic-site`:
      - [ ] See a `circular geographic-marker` for the `geographic-site` that has: [Issue #254](https://github.com/wtchg-kwiatkowski/observatory-web/issues/254)
        - [x] `antimalarial-drug-resistance-status colour-gradation`
        - [x] `size relative to sample count`
        - [ ] If you have a `pointer`, see the `tooltip` when you hover over the `circular geographic-marker`, showing `predicted percentage of antimalarial-drug-resistance` [Issue #270](https://github.com/wtchg-kwiatkowski/observatory-web/issues/270)
        - [x] Click on the `circular geographic-marker` to see:
          - [x] the `predicted percentage of antimalarial-drug-resistance`
          - [x] the `geographic-site button`
            - [x] Click on the `geographic-site button` to see the `geographic-site page`
  - [x] Drag on the `geographic-map` to pan left, right, up and down
  - [x] Click on the `geographic-map zoom buttons` to zoom in and out
  - [x] If you have a `pointer` and a `scroll-wheel`, scroll up and down while hovering over the `geographic-map` to zoom in and out
  - [x] Click on the `antimalarial-drug geographic-map button` to see the `antimalarial-drug geographic-map page` for the `antimalarial-drug`
- [x] See the `antimalarial-drug resistance by geographic-region barchart`
  - [x] See the `antimalarial-drug resistance by geographic-region barchart introduction`
  - [x] See the `antimalarial-drug resistance by geographic-region barchart total counts explanation`
  - [x] See a `barchart bar` for every `geographic-region`
  - For each `geographic-region`:
    - [x] See the `predicted proportion of antimalarial-drug-resistance` for that `geographic-region`, expressed as:
      - [x] `numerator and denominator`
      - [x] `percentage`
      - [x] `barchart bar-width of total-width`
      - [x] `colour-gradation`
    - [x] Click on a `geographic-region` to see the `antimalarial-drug-resistance in geographic-region page`
    - [ ] If you have a `pointer`, see the `tooltip` when you hover over the `numerator bar`, showing `predicted percentage of antimalarial-drug-resistance`
- [x] Click on the `technical document about antimalarial-drug-resistance prediction button` to see the `technical document about antimalarial-drug-resistance prediction`

### From the `resistance-map page`
- [x] See the `all antimalarial-drugs map introduction`
- [x] See the `all antimalarial-drugs map`
  - [ ] See the `all antimalarial-drugs geographic-site markers` [Issue #250](https://github.com/wtchg-kwiatkowski/observatory-web/issues/250)
    - For each `all antimalarial-drugs geographic-site marker`
      - [ ] See the `antimalarial-drug-resistance-status colour-gradation` for every `antimalarial-drug` at the `geographic-site` [Issue #250](https://github.com/wtchg-kwiatkowski/observatory-web/issues/250)
      - [x] Click on the `geographic-site marker` to see a `geographic-map popup`, showing:
        - [x] the `geographic-site name`
        - [x] the `geographic-site country name`
        - [x] the `number and type of samples collected from the geographic-site`
        - [x] the `study-origin of samples collected from the geographic-site`
        - [x] the `antimalarial-drug-resistance-status colour-gradation` for every `antimalarial-drug` at the `geographic-site`
        - [x] the `geographic-site button`
          - [x] Click on the `geographic-site button` to see the `geographic-site page`
- [x] See the `all antimalarial-drugs geographic-site marker legend`
- [ ] See the `legend for the antimalarial-drug-resistance-status colour-gradation` [Issue #249](https://github.com/wtchg-kwiatkowski/observatory-web/issues/249)
- [x] See the `list of antimalarial-drugs`
  - [x] Click on an `antimalarial-drug` to see the `antimalarial-drug geographic-map page` for the `antimalarial-drug`

### From a `antimalarial-drug geographic-map page`
- [x] See the `antimalarial-drug geographic-map introduction`
- [x] See the `antimalarial-drug geographic-map`
  - [x] See the `geographic-site markers`
    - For each `geographic-site marker`
    - [x] Click on the `geographic-site marker` to see a `geographic-map popup`, showing:
      - [x] the `geographic-site name`
      - [x] the `predicted percentage of antimalarial-drug-resistance` in the `geographic-site`
      - [x] a `geographic-site button`
        - [x] Click on the `geographic-site button` to see the `geographic-site page`
  - [x] See the `geographic-region polygons`
- [x] See the `list of antimalarial-drugs`
  - [x] Click on an `antimalarial-drug` to see the `antimalarial-drug geographic-map page` for the `antimalarial-drug`

### From the `geographic-site page`
- [x] See the `geographic-site name`
- [x] See the `geographic-site country name`
- [x] See the `number and type of samples collected from the geographic-site`
- [x] See the `sample-collection date-range for the geographic-site`
- [x] See the `number of studies that contributed samples at the geographic-site`
- For each `study-origin` at the `geographic-site`:
  - [x] See the `number and type of samples collected from the study`
  - [x] See the `sample-collection date-range for the study`
  - [x] See the `sample-collector names for the study`
  - [x] See the `study identifier`
- [x] See the `all antimalarial-drugs map for the geographic-site`
  - [x] Drag on the `all antimalarial-drugs map` to pan left, right, up and down
  - [x] Click on the `geographic-map zoom buttons` to zoom in and out
  - [x] If you have a `pointer` and a `scroll-wheel`, scroll up and down while hovering over the `geographic-map` to zoom in and out
  - [x] See the `all antimalarial-drugs geographic-site marker`
  - [x] See the `all antimalarial-drugs geographic-site marker legend`
- [x] See the `antimalarial-drug resistance by geographic-site barchart`
  - [x] See the `antimalarial-drug resistance by geographic-site barchart introduction`
  - [x] See the `antimalarial-drug resistance by geographic-site barchart total counts explanation`
  - [x] See a `barchart bar` for every `antimalarial-drug`
  - For each `antimalarial-drug`:
    - [x] See the `predicted proportion of antimalarial-drug-resistance` for the `geographic-site`, expressed as:
      - [x] `numerator and denominator`
      - [x] `percentage`
      - [x] `barchart bar-width of total-width`
      - [x] `colour-gradation`
    - [x] Click on a `antimalarial-drug` to see the `antimalarial-drug page`
    - [ ] If you have a `pointer`, see the `tooltip` when you hover over the `numerator bar`, showing `predicted percentage of antimalarial-drug-resistance`
- [x] Click on the `site-samples table button` to see the `site-samples table page`

### From any `table page`
- [ ] See the `table entity-type icon` [Issue #128](https://github.com/wtchg-kwiatkowski/observatory-web/issues/128)
- [ ] See the `table introduction` [Issue #267](https://github.com/wtchg-kwiatkowski/observatory-web/issues/267)
- [x] If no `table-filter` is in effect, click on the `add table-filter button` to add a `table-filter` to the `table` using the `construct-and-apply-table-filter modal-dialog`
- [x] If a `table-filter` is in effect, click on the `change table-filter button` to change the `table-filter` using the `construct-and-apply-table-filter modal-dialog`
- [x] Click on the `select columns button` to toggle the `columns` for the `table` using the `column-selector modal-dialog`
- [ ] Specify the `search-text` for the `table text-search` to see only the rows that contain the `search-text` in `text-searchable columns` [Issue #213](https://github.com/wtchg-kwiatkowski/observatory-web/issues/213) [Issue #305](https://github.com/wtchg-kwiatkowski/observatory-web/issues/305)
- [ ] If a `table text-search` is in effect, see the current `search-text` [Issue #212](https://github.com/wtchg-kwiatkowski/observatory-web/issues/212)
- [ ] Click on the `table-data-download button` to receive the current `table-data as a tab-delimited file` [Issue #304](https://github.com/wtchg-kwiatkowski/observatory-web/issues/304)
- [x] Click on the `table-pivot button` to see the `table-pivot page` for the `table`
- [x] Click on the `table-plot button` to see the `table-plot page` for the `table`
- [ ] Click on the `collapse side-menu button` to collapse the `side-menu` [Issue #174](https://github.com/wtchg-kwiatkowski/observatory-web/issues/174) [Issue #268](https://github.com/wtchg-kwiatkowski/observatory-web/issues/268)
- [ ] If a `table-filter` is in effect, see the current `table-filter` [Issue #144](https://github.com/wtchg-kwiatkowski/observatory-web/issues/144)
- [ ] If a `table-data column-sort` is in effect, see the current `table-data column-sort` [Issue #216](https://github.com/wtchg-kwiatkowski/observatory-web/issues/216)
- [x] See the `cardinal number of columns currently being shown`
- [x] See the `cardinal number of columns available to be shown`
- [x] See the `ordinal number of the first row currently being shown`
- [x] See the `ordinal number of the last row currently being shown`
- [x] See the `cardinal number of rows available to be shown`
- [x] If the `cardinal number of rows available to be shown` is more than _table-data page-rows-size_ rows (i.e. there is more than one `page of table-data` available), and the `ordinal number of the last row currently being shown` is less than the `cardinal number of rows available to be shown` (i.e. the last `page of table-data` is not being shown), click on the `next page of table-data button` to see the `next page of table-data`
- [x] If the `cardinal number of rows available to be shown` is more than _table-data page-rows-size_ rows (i.e. there is more than one `page of table-data` available), and the `ordinal number of the last row currently being shown` is less than the `cardinal number of rows available to be shown` (i.e. the last `page of table-data` is not being shown), click on the `last page of table-data button` to see the `last page of table-data`
- [x] If the `cardinal number of rows available to be shown` is more than _table-data page-rows-size_ rows (i.e. there is more than one `page of table-data` available), and the `ordinal number of the first row currently being shown` is more than the _table-data page-rows-size_ rows (i.e. the first `page of table-data` is not being shown), click on the `previous page of table-data button` to see the `previous page of table-data`
- [x] If the `cardinal number of rows available to be shown` is more than _table-data page-rows-size_ rows (i.e. there is more than one `page of table-data` available), and the `ordinal number of the first row currently being shown` is more than the _table-data page-rows-size_ rows (i.e. the first `page of table-data` is not being shown), click on the `first page of table-data button` to see the `first page of table-data`
- [x] See the `column labels` in the `column headings` for all of the `selected columns`
  - [x] If the `column` has a `column description`, click on the `column information icon-button` in the `column heading` to see the `column description`
- [ ] See the `table-data values` for all of the `selected columns` and all of the `rows currently being shown` [Issue #215](https://github.com/wtchg-kwiatkowski/observatory-web/issues/215)
- [x] Click on a `column heading` to toggle the `column sort-order` for that `column` and to change the current `table-data column-sort`
- [x] If the `column` contains `key internal table-data values`, click on any `key internal table-data value` to see more information relating to that `key internal table-data value`
- [x] If the `column` contains `key external-reference-values`, click on any `key external-reference-value` to see more information relating to that `key external-reference-value` in a `new web-browser tab`
- [ ] If the `column` contains `categorical values`, see appropriate `table-cell background-colour-gradation` for those `table-data cells` [Issue #306](https://github.com/wtchg-kwiatkowski/observatory-web/issues/306) [Issue #307](https://github.com/wtchg-kwiatkowski/observatory-web/issues/307)

### From the `construct-and-apply-table-filter modal-dialog`
- [x] See the `modal-dialog title`
- [x] See the `modal-dialog entity-icon`
- [x] See the `modal-dialog description`
- [ ] See the `list of predefined table-filters` [Issue #170](https://github.com/wtchg-kwiatkowski/observatory-web/issues/170)
  - [x] Click on a `predefined table-filter` to see the `table-filter diagram` and the `table-filter string-representation` for that `table-filter`
- [x] See the `list of recently applied table-filters`
  - [x] Click on a `recently applied table-filter` to see the `table-filter diagram` and the `table-filter string-representation` for that `table-filter`
- [x] See the `table-filter diagram` of the `table-filter in construction`
- [x] If there are no `table-filter-criterion` in the `table-filter diagram`, click on the `add table-filter-criterion button` to add a `table-filter-criterion` using the `table-filter-criterion editor`
- [x] If there are `table-filter-criterion` in the `table-filter diagram`, change any `table-filter-criterion` using the `table-filter-criterion editor` for any of the `table-filter criteria`
- [ ] Click on the `apply table-filter button` to set the `table-filter in construction` (represented by the `table-filter diagram` and the `table-filter string-representation`) as the `table-filter`
[Issue #283](https://github.com/wtchg-kwiatkowski/observatory-web/issues/283)
- [x] If there is a `table-filter in construction` (represented by `table-filter-criteria` in the `table-filter diagram`) see the `table-filter string representation` of the `table-filter in construction`
- [x] If there is no `table-filter in construction` (represented by no `table-filter-criteria` in the `table-filter diagram`) see the `no-table-filter message`
- [ ] Click on the `cancel-and-close modal-dialog button` to cancel and close the `construct-and-apply-table-filter modal-dialog` [Issue #148](https://github.com/wtchg-kwiatkowski/observatory-web/issues/148)

### In the `table-filter-criterion editor`
- [x] Select a `column` from the `column selector` to use in the `table-filter-criterion`
  - [ ] Select a `comparison operator` from the `comparison operator selector` to use in the `table-filter-criterion` [Issue #309](https://github.com/wtchg-kwiatkowski/observatory-web/issues/309)
    - If a `column with categorized-values` has been selected:
      - [ ] If the `value-is-equal-to-categorized-value operator` is selected, select the `categorized-value` [Issue #196](https://github.com/wtchg-kwiatkowski/observatory-web/issues/196)
      - [ ] If the `value-is-not-equal-to-categorized-value operator` is selected, select the `categorized-value` [Issue #196](https://github.com/wtchg-kwiatkowski/observatory-web/issues/196)
    - If a `column without categorized-values` has been selected:
      - [ ] If the `value-is-equal-to-comparison-text operator` is selected, enter the `comparison-text` [Issue #196](https://github.com/wtchg-kwiatkowski/observatory-web/issues/196)
      - [ ] If the `value-is-not-equal-to-comparison-text operator` is selected, enter the `comparison-text` [Issue #196](https://github.com/wtchg-kwiatkowski/observatory-web/issues/196)
    - If a `string-type column` has been selected:
      - [x] If the `value-contains-text operator` is selected, enter the `comparison-text`
      - [x] If the `value-does-not-contain-text operator` is selected, enter the `comparison-text`
      - [x] If the `value-starts-with-text operator` is selected, enter the `comparison-text`
      - [ ] If the `value-ends-with-text operator` is selected, enter the `comparison-text`
      - [x] If the `value-is-empty operator` is selected, the `table-filter-criterion`
      - [x] If the `value-is-not-empty operator` is selected, the `table-filter-criterion`
      - [x] If the `value-is-equal-to-another-column-value` is selected, select the `other column` from the `other column selector`
      - [x] If the `value-is-not-equal-to-another-column-value` is selected, select the `other column` from the `other column selector`
    - If a `number-type column` has been selected:
      - [x] If the `value-is-less-than-text operator` is selected, enter the `comparison-text`
      - [x] If the `value-is-greater-than-text operator` is selected, enter the `comparison-text`
      - [x] If the `value-is-less-than-or-equal-to-comparison-text operator` is selected, enter the `comparison-text`
      - [x] If the `value-is-greater-than-or-equal-to-comparison-text operator` is selected, enter the `comparison-text`
      - [x] If the `value-is-between-text-and-other-text` is selected, enter the `comparison-text` and `other comparison-text`
      - [x] If the `value-is-empty operator` is selected, the `table-filter-criterion`
      - [x] If the `value-is-not-empty operator` is selected, the `table-filter-criterion`
      - [x] If the `value-is-equal-to-another-column-value` is selected, select the `other column` from the `other column selector`
      - [x] If the `value-is-not-equal-to-another-column-value` is selected, select the `other column` from the `other column selector`
      - [x] If the `value-is-less-than-another-column-value operator` is selected, select the `other column` from the `other column selector` and specify the `other column linear coefficient` and the `other column constant coefficient`
      - [x] If the `value-is-greater-than-another-column operator` is selected, select the `other column` from the `other column selector` and specify the `other column linear coefficient` and the `other column constant coefficient` 
- [x] Click on the `add or-criterion-relationship button` to add an `or-criterion-relationship` to the `table-filter in construction`
- [x] Click on the `add and-criterion-relationship button` to add an `and-criterion-relationship` to the `table-filter in construction`
- [ ] Click on the `delete table-filter-criterion button` to delete the `table-filter-criterion` [Issue #311](https://github.com/wtchg-kwiatkowski/observatory-web/issues/311)

### From the `column-selector modal-dialog`
- [x] See the `modal-dialog title`
- [x] See a `column-selector search textbox`
  - [x] Type into `column-selector search textbox` to restrict the list of `table columns` to those that match
    - [ ] See the matching text highlighted in the list of `table columns` [Issue #258](https://github.com/wtchg-kwiatkowski/observatory-web/issues/258)
- [x] See the `list of columns available`
  - For each `available column`:
    - [x] See the `column label`
    - [x] See the `column data-type icon`
    - [x] For any `column label` that is not self-explanatory, see the `column description`
    - [x] Click on the `column label`, `column description` or `column data-type icon` to add that `column` to the `list of selected columns`
    - [ ] See whether the `column` is included or excluded from the `table` [Issue #262](https://github.com/wtchg-kwiatkowski/observatory-web/issues/262)
- [x] See the `list of selected columns`
  - For each `selected column`
    - [x] See the `column label`
    - [x] See the `column data-type icon`
    - [x] For any `column label` that is not self-explanatory, see the `column description`
    - [x] Click on the `column label`, `column description` or `column data-type icon` to remove that `column` from the `list of selected columns`
- [ ] Click on the `include all columns button` to include the `list of columns available` in the `table` [Issue #224](https://github.com/wtchg-kwiatkowski/observatory-web/issues/224)
- [ ] Click on the `exclude all columns button` to include the `list of columns available` in the `table` [Issue #224](https://github.com/wtchg-kwiatkowski/observatory-web/issues/224)
- [x] Click on the `apply column selection button` to apply the `list of selected columns` to the `table page`
- [ ] Click on the `cancel-and-close modal-dialog button` to cancel and close the `column-selector modal-dialog` [Issue #148](https://github.com/wtchg-kwiatkowski/observatory-web/issues/148)

### From the `table-pivot page`
- [x] See the `table-pivot icon`
- [x] See the `table-pivot introduction`
- [x] If no `table-filter` is in effect, click on the `add table-filter button` to add a `table-filter` to the `table` using the `construct-and-apply-table-filter modal-dialog`
- [x] If a `table-filter` is in effect, click on the `change table-filter button` to change the `table-filter` using the `construct-and-apply-table-filter modal-dialog`
- [ ] Select a `column` from the `column selector` to specify the `table-pivot column-column` for the `table-pivot` [Issue #228](https://github.com/wtchg-kwiatkowski/observatory-web/issues/228) [Issue #319](https://github.com/wtchg-kwiatkowski/observatory-web/issues/319)
- [ ] Select an `other column` from the `other column selector` to specify the `table-pivot row-column` for the `table-pivot` [Issue #228](https://github.com/wtchg-kwiatkowski/observatory-web/issues/228)
- [x] Select a `table-pivot aggregate-type` from the `table-pivot aggregate-type selector` to specify the `table-pivot aggregate-type` for the `table-pivot`
- [x] If a `table-pivot column-column` and `table-pivot row-column` and `table-pivot aggregate-type` have been selected/specified, see the `table-pivot table-data`
  - [x] See the `table-pivot column-column values as labels` in the `column headings` for the selected/specified `table-pivot column-column`
  - [x] See the `table-pivot row-column values as labels` in the `row headings` for the selected/specified `table-pivot row-column`
  - [ ] Click on a `column heading` to toggle the `column sort-order` for that `column` and to change the current `table-data column-sort` [Issue #318](https://github.com/wtchg-kwiatkowski/observatory-web/issues/318)
  - [ ] Click on a `row heading` to toggle the `row sort-order` for that `row` and to change the current `table-data row-sort` [Issue #318](https://github.com/wtchg-kwiatkowski/observatory-web/issues/318)
  - [x] If the `table-pivot column-column` contains `key internal table-data values`, click on any `key internal table-data value` to see more information relating to that `key internal table-data value`
  - [x] If the `table-pivot row-column` contains `key internal table-data values`, click on any `key internal table-data value` to see more information relating to that `key internal table-data value`
  - [x] If the `table-pivot column-column` contains `key external-reference-values`, click on any `key external-reference-value` to see more information relating to that `key external-reference-value` in a `new web-browser tab`
  - [x] If the `table-pivot row-column` contains `key external-reference-values`, click on any `key external-reference-value` to see more information relating to that `key external-reference-value` in a `new web-browser tab`
  - [x] If the `table-pivot column-column` contains `categorical values`, see appropriate `table-cell background-colour-gradation` for those `table-pivot column-column values as labels`
  - [x] If the `table-pivot row-column` contains `categorical values`, see appropriate `table-cell background-colour-gradation` for those `table-pivot row-column values as labels`
  - [x] See the `table-pivot table-data values` for the selected/specified `table-pivot column-column` and `table-pivot row-column` and `table-pivot aggregate-type`
    - [x] If the `table-pivot aggregate-type counts` is selected, see the `table-pivot count` for each of the `table-data cells`
    - [x] If the `table-pivot aggregate-type percentage-of-total` is selected, see the `table-pivot percentage-of-total` for each of the `table-data cells` with appropriate `table-cell background-colour-gradation`
    - [x] If the `table-pivot aggregate-type percentage-of-column-total` is selected, see the `table-pivot percentage-of-column-total` for each of the `table-data cells` with appropriate `table-cell background-colour-gradation`
    - [x] If the `table-pivot aggregate-type percentage-of-row-total` is selected, see the `table-pivot percentage-of-row-total` for each of the `table-data cells` with appropriate `table-cell background-colour-gradation`
  - [ ] See the `table-pivot aggregate-type heading for all column-columns` [Issue #230](https://github.com/wtchg-kwiatkowski/observatory-web/issues/230)
  - [x] See the `table-pivot aggregate-type values for all column-columns`
  - [ ] See the `table-pivot aggregate-type heading for all row-columns` [Issue #230](https://github.com/wtchg-kwiatkowski/observatory-web/issues/230)
  - [x] See the `table-pivot aggregate-type values for all row-columns`
  - [ ] See the `column name` of the selected `table-pivot column-column` in the `heading for the table-pivot column-columns` [Issue #231](https://github.com/wtchg-kwiatkowski/observatory-web/issues/231)
  - [x] See the `column name` of the selected `table-pivot row-column` in the `heading for the table-pivot row-columns`
  - [ ] If the selected `table-pivot column-column` has a `column description`, click on the `column information icon-button` in the `heading for the table-pivot column-columns` to see the `column description` [Issue #233](https://github.com/wtchg-kwiatkowski/observatory-web/issues/233)
  - [ ] If the selected `table-pivot row-column` has a `column description`, click on the `column information icon-button` in the `heading for the table-pivot row-columns` to see the `column description` [Issue #233](https://github.com/wtchg-kwiatkowski/observatory-web/issues/233)
  - [ ] Click on any `table-data cell` to see a `table page` with a `table-filter` corresponding to the `aggregate value` [Issue #232](https://github.com/wtchg-kwiatkowski/observatory-web/issues/232)
- [ ] Click on the `collapse side-menu button` to collapse the `side-menu` [Issue #174](https://github.com/wtchg-kwiatkowski/observatory-web/issues/174) [Issue #268](https://github.com/wtchg-kwiatkowski/observatory-web/issues/268)
- [ ] If a `table-filter` is in effect, see the current `table-filter` [Issue #144](https://github.com/wtchg-kwiatkowski/observatory-web/issues/144)
- [ ] If a `table-data column-sort` is in effect, see the current `table-data column-sort` [Issue #216](https://github.com/wtchg-kwiatkowski/observatory-web/issues/216)
- [ ] If a `table-data row-sort` is in effect, see the current `table-data row-sort` [Issue #216](https://github.com/wtchg-kwiatkowski/observatory-web/issues/216)

### From the `table-plot page`
- [x] See the `table-plot icon`
- [x] See the `table-plot introduction`
- [x] Select a `table` from the `table selector` to use as the `table-plot table` in the `table-plot`
- [x] If no `table-filter` is in effect, click on the `add table-filter button` to add a `table-filter` to the `table` using the `construct-and-apply-table-filter modal-dialog`
- [x] If a `table-filter` is in effect, click on the `change table-filter button` to change the `table-filter` using the `construct-and-apply-table-filter modal-dialog`
- [ ] If a `table-filter` is in effect, see the current `table-filter` [Issue #144](https://github.com/wtchg-kwiatkowski/observatory-web/issues/330) [Issue #330](https://github.com/wtchg-kwiatkowski/observatory-web/issues/330)
- [x] Select a `random sample-subset size` from the `random sample-subset size selector` to use in the `table-plot`
- [x] Select a `table-plot plot-type` from the `table-plot plot-type selector` to use in the `table-plot`
- [x] If the `table-plot plot-type bar` is selected, see the `table-plot horizontal-axis-column selector` and the `table-plot vertical-axis-column selector`
- [x] If the `table-plot plot-type histogram` is selected, see the `table-plot horizontal-axis-column selector`
- [x] If the `table-plot plot-type two-dimensional-histogram` is selected, see the `table-plot horizontal-axis-column selector` and the `table-plot vertical-axis-column selector`
- [x] If the `table-plot plot-type box-and-whisker` is selected, see the `table-plot horizontal-axis-column selector` and the `table-plot vertical-axis-column selector`
- [x] If the `table-plot plot-type scatter` is selected, see the `table-plot horizontal-axis-column selector`, the `table-plot vertical-axis-column selector` and the `table-plot colour-column selector`
- [x] If a `table-plot table` and `table-plot plot-type` and the required `table-plot column selectors` have been selected, see the `table-plot plot-data`
  - [x] See the `labelled axes`
  - [x] Click on the `table-plot download-as-a-png-file button` to download the `table-plot as a png file`
  - [x] Click on the `table-plot open-and-edit-in-plotly button` to open the `table-plot` in the `plotly website`
  - [x] Click on the `table-plot zoom-enable button` to enable the `table-plot zoom features` (they are enabled by default) and disable the `table-plot pan features`
  - If the `table-plot zoom features` are enabled (they are enabled by default) and you have a `pointer`:
    - [x] Click and drag on the `table-plot` to `zoom in`, by specifying a rectangular area
    - [x] Double-click on the `table-plot` to `zoom out`
  - [x] Click on the `table-plot pan-enable button` to enable the `table-plot pan features` (they are disabled by default) and disable the `table-plot zoom features`
  - If the `table-plot pan features` are enabled (they are disabled by default) and you have a `pointer`:
    - [x] Click and drag on the `table-plot` to `pan`
  - [x] Click on the `table-plot zoom-in button` to `zoom in`
  - [x] Click on the `table-plot zoom-out button` to `zoom out`
  - [x] Click on the `table-plot auto-scale button` to `auto-scale`
  - [ ] Click on the `table-plot reset-axes button` to `reset axes` [Issue #331](https://github.com/wtchg-kwiatkowski/observatory-web/issues/331)
  - [x] Click on the `table-plot show-closest-data-on-hover button` to enable the `table-plot show-closest-data-on-hover feature` (it is disabled by default) and disable the `table-plot compare-data-on-hover feature`
  - [x] Click on the `table-plot compare-data-on-hover button` to enable the `table-plot compare-data-on-hover feature` (it is disabled by default) and disable the `table-plot show-closest-data-on-hover feature`
  - If the `show-closest-data-on-hover feature` is enabled (it is disabled by default) and you have a `pointer`:
    - [x] Hover over a `plotted bar` to see the `table-plot horizontal-axis-column value` and the `table-plot vertical-axis-column value`
    - [x] Click on the `table-plot toggle-spike-lines button` to `toggle spike lines`
  - If the `table-plot plot-type bar` is selected:
    - [x] See the `plotted bars`
  - If the `table-plot plot-type histogram` is selected:`
    - [x] See the `plotted bars`
  - If the `table-plot plot-type two-dimensional-histogram` is selected:
    - [x] See the `plotted areas`
    - [x] See the `two-dimensional-histogram legend`
  - If the `table-plot plot-type box-and-whisker` is selected:
    - [x] See the `plotted boxes-with-whiskers`
  - If the `table-plot plot-type scatter` is selected and no `table-plot colour-column` has been selected:
    - [x] See the `plotted points`
  - If the `table-plot plot-type scatter` is selected and a `table-plot colour-column` has been selected:
    - [x] See the `plotted colour-coded-points`
    - [x] See the `colour-coded-point legend`

### From the `samples-table page`
- [ ] All the features of a generic `table page`

### From the `variants-table page`
- [ ] All the features of a generic `table page`

### From a `site-samples table page`
- [ ] All the features of a generic `table page`

### From the `antimalarial-drug-resistance genes page`
- [x] See the `genes that MalariaGEN Analytics says are involved in antimalarial-drug-resistance`
  - For each `antimalarial-drug-resistance gene`:
    - [x] See the `antimalarial-drug-resistance gene short-name`
    - [x] See the `antimalarial-drug-resistance gene short-description
    - [x] Click on the `antimalarial-drug-resistance gene button` to see the `antimalarial-drug-resistance gene page`

### From a `antimalarial-drug-resistance gene page`
- [x] See the `antimalarial-drug-resistance gene short-name`
- [x] See the `antimalarial-drug-resistance gene long-name`
- [x] See the `antimalarial-drug-resistance gene long-description`
- [x] Click on the `antimalarial-drug button` to see the `antimalarial-drug page`
- [x] See the `colour-gradated bar-chart of antimalarial-drug-resistance as proportion-of-samples for the the full list of geographic-regions for the antimalarial-drug`
- [x] See the `antimalarial-drug-resistance gene variation description`
- [x] Click on the `antimalarial-drug-resistance gene variants-table button` to see the `antimalarial-drug-resistance gene variants-table page`

### From the `antimalarial-drug-resistance gene variants-table page`
- [x] See the `table of antimalarial-drug-resistance gene variants`
  - For each `antimalarial-drug-resistance gene variant`:
    - [x] See the `antimalarial-drug-resistance gene variant amino-acid change`
    - [x] See the `antimalarial-drug-resistance gene variant position`
    - [x] See the `colour-gradated antimalarial-drug-resistance gene variant non-reference allele frequency for each geographic-region`
  - [x] Click on the `column label` to toggle the `column sort order` between `ascending order`, `descending order` or `default order`
    - [x] See the current `column sort order` of each `column`
  - [x] For any `column label` that is not self-explanatory, click on the `column information icon-button` to see the `column description`
  - For each row:
    - [x] Click on the `row` to see the `row summary tooltip`

### From the `genome-browser page`
- [x] See the `genome-browser icon`
- [x] See the `genome-browser introduction`
- [x] Click on the `add genome-browser channels button` to see the `genome-browser channel-adder modal-dialog`
- [x] See a button to view the `variants-table page`
- [ ] Click on the `collapse side-menu button` to collapse the `side-menu` [Issue #174](https://github.com/wtchg-kwiatkowski/observatory-web/issues/174) [Issue #268](https://github.com/wtchg-kwiatkowski/observatory-web/issues/268)
- [x] See the `genome-browser chromosome being displayed`
- [x] Select a `genome-browser chromosome` using the `genome-browser chromosome selector` to change the `genome-browser chromosome being displayed`
- [x] See the `genome-browser chromosome being displayed`
- [x] See and edit the `genome-browser chromosome-region being displayed`
- [x] See and edit the `genome-browser base-position-midpoint of the chromosome-region being displayed`
- [x] See and edit the `genome-browser width-in-base-positions of the chromosome-region being displayed`
- [x] See the `genome-browser base-position-ticks of the chromosome-region being displayed`
- [x] See the `genome-browser reference-sequence channel`
  - [x] If you are zoomed out, see the `genome-browser reference-sequence summarized-base-colours`
  - [x] If you are zoomed in, see the `genome-browser reference-sequence base-letters` and their corresponding `genome-browser reference-sequence base-colours`
  - [ ] Click on the `genome-browser-channel information-area icon-button` to toggle the appearance of the `genome-browser-channel information-area` for the `genome-browser reference-sequence channel` [Issue #139](https://github.com/wtchg-kwiatkowski/observatory-web/issues/139)
    - If the `genome-browser-channel information-area` is showing for the `genome-browser reference-sequence channel`:
      - [x] See the `genome-browser reference-sequence base-colours legend`
      - [ ] Click on the `genome-browser reference-sequence display-sequence button` to display the `genome-browser reference-sequence being displayed` as a `string of text` inside a `tooltip` [Issue #192](https://github.com/wtchg-kwiatkowski/observatory-web/issues/192) [Issue #156](https://github.com/wtchg-kwiatkowski/observatory-web/issues/156)
- [x] See the `genome-browser genes channel`
  - If there is a `gene` within the `chromosome-region being displayed`:
    - [ ] See the `genome-browser genes-channel gene` [Issue #158](https://github.com/wtchg-kwiatkowski/observatory-web/issues/158) [Issue #159](https://github.com/wtchg-kwiatkowski/observatory-web/issues/159)
      - [x] See the `genome-browser genes-channel gene coding-sequence regions`
  - [ ] Click on the `genome-browser-channel information icon-button` to toggle the appearance of the `genome-browser-channel information` for the `genome-browser genes channel` [Issue #139](https://github.com/wtchg-kwiatkowski/observatory-web/issues/139)
    - If the `genome-browser-channel information` is showing:
      - [x] See the `genome-browser genes-channel gene legend`
- If it is the first time that you have loaded the `genome-browser page` or you haven't modified the `genome-browser` (if the `genome-browser` has the `default genome-browser state`):
  - [x] See the `genome-browser variants channel`
    - [ ] Click on the `close genome-browser-channel button` to close the `genome-browser variants channel` [Issue #134](https://github.com/wtchg-kwiatkowski/observatory-web/issues/134)
    - [x] Click on the `genome-browser-channel settings-area icon-button` to toggle the appearance of the `genome-browser-channel settings-area` for the `genome-browser variants channel`
      - If the `genome-browser-channel settings-area` is showing for the `genome-browser variants channel`:
        - [x] If no `table-filter` is in effect, click on the `add table-filter button` to add a `table-filter` to the `table` using the `construct-and-apply-table-filter modal-dialog`
        - If a `table-filter` is in effect:
          - [ ] See the current `table-filter` [Issue #144](https://github.com/wtchg-kwiatkowski/observatory-web/issues/144)
          - [x] Click on the `change table-filter button` to change the `table-filter` using the `construct-and-apply-table-filter modal-dialog`
        - [x] Select a `colour-by-column column` from the `colour-by-column column-selector` to show a `categorical colour` for each of the `genome-browser-channel track-items` corresponding to the `distinct column values` in the selected `colour-by-column column` [Issue #337](https://github.com/wtchg-kwiatkowski/observatory-web/issues/337)
    - [x] See the `genome-browser track-items`
    - [x] Click on a `genome-browser variants-channel track-item` to see the `variant page` for that `variant`
    - [ ] If you have a `pointer`, hover over the `genome-browser variants-channel track-item` to see the `genomic position` of that `variant` [Issue #339](https://github.com/wtchg-kwiatkowski/observatory-web/issues/339)
  - [x] See the `genome-browser global-fst-variant channel`
    - [ ] Click on the `close genome-browser-channel button` to close the `genome-browser variants channel` [Issue #134](https://github.com/wtchg-kwiatkowski/observatory-web/issues/134)
    - [x] Click on the `genome-browser-channel settings-area icon-button` to toggle the appearance of the `genome-browser-channel settings-area` for the `genome-browser variants channel`
      - If the `genome-browser-channel settings-area` is showing for the `genome-browser variants channel`:
        - [ ] Click on the `genome-browser-channel select genome-browser-channel-track button` to change the `genome-browser channel-tracks` for the `genome-browser channel` using the `genome-browser-channel-track-selector modal-dialog` [Issue #203](https://github.com/wtchg-kwiatkowski/observatory-web/issues/203)
        - [x] If no `table-filter` is in effect, click on the `add table-filter button` to add a `table-filter` to the `table` using the `construct-and-apply-table-filter modal-dialog`
        - If a `table-filter` is in effect:
          - [ ] See the current `table-filter` [Issue #144](https://github.com/wtchg-kwiatkowski/observatory-web/issues/144)
          - [x] Click on the `change table-filter button` to change the `table-filter` using the `construct-and-apply-table-filter modal-dialog`
        - [ ] See whether the `genome-browser-channel auto-y-scale feature` is `enabled` [Issue #145](https://github.com/wtchg-kwiatkowski/observatory-web/issues/145) [Issue #186](https://github.com/wtchg-kwiatkowski/observatory-web/issues/186)
        - [x] Click on the `genome-browser-channel auto-y-scale feature-checkbox` to toggle the `genome-browser-channel auto-y-scale feature`
        - [x] If the `genome-browser-channel auto-y-scale feature` is `enabled`, see that the `genome-browser-channel track-area` has an `automatically scaled y-axis`
        - If the `genome-browser-channel auto-y-scale feature` is `disabled`:
          - [ ] Specify the `y-axis minimum value` for the `genome-browser-channel track-area` [Issue #340](https://github.com/wtchg-kwiatkowski/observatory-web/issues/340)
          - [x] Specify the `y-axis maximum value` for the `genome-browser-channel track-area`
    - [x] See the selected `genome-browser channel-tracks` for the `genome-browser channel`
      - [ ] See the `genome-browser-channel-track data` for each `genome-browser channel-track` for the `genome-browser chromosome-region being displayed` [Issue #142](https://github.com/wtchg-kwiatkowski/observatory-web/issues/142)
      - [x] See the `genome-browser-channel y-axis tick-values`
    - [ ] Click on the `genome-browser-channel information icon-button` to toggle the appearance of the `genome-browser-channel information` for the `genome-browser global-fst-variant channel` [Issue #139](https://github.com/wtchg-kwiatkowski/observatory-web/issues/139)
      - If the `genome-browser-channel information` is showing:
        - [ ] See a `genome-browser track-colour legend` for each `genome-browser channel-track` [Issue #341](https://github.com/wtchg-kwiatkowski/observatory-web/issues/341)
- [x] See any channels that you added using the `genome-browser channel-adder modal-dialog`
  - For any `genome-browser channel being displayed`:
    - [ ] Click on the `close genome-browser-channel button` to close the `genome-browser variants channel` [Issue #134](https://github.com/wtchg-kwiatkowski/observatory-web/issues/134)
    - [x] Click on the `genome-browser-channel settings-area icon-button` to toggle the appearance of the `genome-browser-channel settings-area` for the `genome-browser channel`
    - [x] If the channel has `selectable tracks`, see the selected `genome-browser channel-tracks` for the `genome-browser channel`
      - [ ] See the `genome-browser-channel-track data` for each `genome-browser channel-track` for the `genome-browser chromosome-region being displayed` [Issue #142](https://github.com/wtchg-kwiatkowski/observatory-web/issues/142)
      - [x] See the `genome-browser-channel y-axis tick-values`
    - [ ] Click on the `genome-browser-channel information icon-button` to toggle the appearance of the `genome-browser-channel information` for the `genome-browser channel` [Issue #139](https://github.com/wtchg-kwiatkowski/observatory-web/issues/139)
    - If the `genome-browser-channel information` is showing:
      - [ ] See a `genome-browser track-colour legend` for each `genome-browser channel-track` [Issue #341](https://github.com/wtchg-kwiatkowski/observatory-web/issues/341)
    - If the `genome-browser channel being displayed` contains `genome-browser channel-tracks` relating to `number-type columns` that do not contain `categorical values`:
      - [ ] See `plotted points` [Issue #344](https://github.com/wtchg-kwiatkowski/observatory-web/issues/344)
      - If the `genome-browser-channel settings-area` is showing for the `genome-browser channel`:
        - [ ] Click on the `genome-browser-channel select genome-browser-channel-track button` to change the `genome-browser channel-tracks` for the `genome-browser channel` using the `genome-browser-channel-track-selector modal-dialog` [Issue #203](https://github.com/wtchg-kwiatkowski/observatory-web/issues/203)
        - [x] If no `table-filter` is in effect, click on the `add table-filter button` to add a `table-filter` to the `table` using the `construct-and-apply-table-filter modal-dialog`
        - If a `table-filter` is in effect:
          - [ ] See the current `table-filter` [Issue #144](https://github.com/wtchg-kwiatkowski/observatory-web/issues/144)
          - [x] Click on the `change table-filter button` to change the `table-filter` using the `construct-and-apply-table-filter modal-dialog`
        - [ ] See whether the `genome-browser-channel auto-y-scale feature` is `enabled` [Issue #145](https://github.com/wtchg-kwiatkowski/observatory-web/issues/145) [Issue #186](https://github.com/wtchg-kwiatkowski/observatory-web/issues/186)
        - [x] Click on the `genome-browser-channel auto-y-scale feature-checkbox` to toggle the `genome-browser-channel auto-y-scale feature`
        - [x] If the `genome-browser-channel auto-y-scale feature` is `enabled`, see that the `genome-browser-channel track-area` has an `automatically scaled y-axis`
        - If the `genome-browser-channel auto-y-scale feature` is `disabled`:
          - [ ] Specify the `y-axis minimum value` for the `genome-browser-channel track-area` [Issue #340](https://github.com/wtchg-kwiatkowski/observatory-web/issues/340)
          - [x] Specify the `y-axis maximum value` for the `genome-browser-channel track-area`
    - If the `genome-browser channel being displayed` contains `genome-browser channel-tracks` relating to `number-type columns` that contain `categorical values`:
      - [ ] FIXME: This scenario shouldn't happen in staging! [Issue #344](https://github.com/wtchg-kwiatkowski/observatory-web/issues/344)
      - [x] See `plotted bars`
    - If you have a `pointer`:
      - [x] If you have a `scroll-wheel`, scroll up and down while hovering over the `genome-browser-channel plotted area` to zoom in and out
      - [x] Drag left and right while hovering over the `genome-browser-channel plotted area` to scroll left and right
      - [x] See a `cross-channel plotted-item-value line` while hovering over the `genome-browser-channel plotted area`
      - [x] See the `plotted-item value` of all `plotted-items` in all `genome-browser channels` at the same position as (falling in line with) the `cross-channel plotted-item-value line`
      - [x] See the `plotted-item value` while hovering over a `plotted-item`
      - [x] See the `plotted item value` while hovering near a `plotted-item`
      - [x] Click on a `genome-browser track-colour colour-swatch` in the `genome-browser track-colour legend` to select a different `genome-browser track-colour` for each `genome-browser channel-track`

### From the `genome-browser-channel-track-selector modal-dialog`
- [x] See a `genome-browser channel-track-selector search textbox`
  - [x] Type into `genome-browser channel-track-selector search textbox` to restrict the `list of genome-browser channel-tracks` to those that match the specified `search-text`
    - [ ] See the matching text highlighted in the `list of genome-browser channel-tracks` [Issue #258](https://github.com/wtchg-kwiatkowski/observatory-web/issues/258)
- [x] See the `list of genome-browser channel-tracks`
  - For each `genome-browser channel-track`:
    - [x] See the `channel-track label`
    - [x] See the `channel-track data-type icon`
    - [x] Click on the `channel-track label` or `channel-track data-type icon` to add that `genome-browser channel-track` to the `list of genome-browser channel-tracks to display`
- [x] Click on the `display list-of-genome-browser-channel-tracks button` to display the `list of genome-browser channel-tracks to display` in the `genome-browser channel`
- [x] Click on the `clear list-of-genome-browser-channel-tracks button` to clear the `list of genome-browser channel-tracks to display`
- [ ] Click on the `cancel-and-close modal-dialog button` to cancel and close the `modal-dialog` [Issue #148](https://github.com/wtchg-kwiatkowski/observatory-web/issues/148)

### From the `genome-browser channel-adder modal-dialog`
- [x] See a `genome-browser channel-adder search textbox`
  - [x] Type into `genome-browser channel-adder search textbox` to restrict the `list of genome-browser channels` to those that match the specified `search-text`
    - [ ] See the matching text highlighted in the `list of genome-browser channels` [Issue #258](https://github.com/wtchg-kwiatkowski/observatory-web/issues/258)
- [x] See the `list of genome-browser channels`
  - For each `genome-browser channel`:
    - [x] See the `channel label`
    - [x] See the `channel data-type icon`
    - [x] For any `channel label` that is not self-explanatory, see the `channel description`
    - [x] Click on the `channel label`,  `channel description` or `channel data-type icon` to add that `genome-browser channel` to the `list of genome-browser channels to add`
- [x] Click on the `add list-of-genome-browser-channels button` to add the `list of genome-browser channels to add` to the `genome-browser`
- [x] Click on the `clear list-of-genome-browser-channels button` to clear the `list of genome-browser channels to add`
- [ ] Click on the `cancel-and-close modal-dialog button` to cancel and close the `modal-dialog` [Issue #148](https://github.com/wtchg-kwiatkowski/observatory-web/issues/148)

### From the `geographic-regions page`
- [x] Select a `geographic-region` from the `geographic-region selector` to see that `geographic-region page`
- [x] Click on the `resistance-map button` to see the `resistance-map page`
- [x] See the `table of resistance status for the full list of antimalarial-drugs and the full list of geographic-regions`
  - For each combination of `antimalarial-drug` and `geographic-region`:
    - [x] See the `antimalarial-drug-resistance-status colour-gradated spot`
    - [x] If you have a `pointer`, see the `predicted percentage of antimalarial-drug-resistance in geographic-region tooltip` when you hover over the `antimalarial-drug-resistance-status colour-gradated spot`
    - [x] Click on the `antimalarial-drug-resistance-status colour-gradated spot` to see the `antimalarial-drug in geographic-region page`
  - [x] See the `legend for the antimalarial-drug-resistance-status colour-gradation`

### From a `geographic-region page`
- [x] See the `geographic-region name`
- [x] See the `geographic-region introduction`
- [x] See a `geographic-map` with a `geographic-map marker` for each `sample site` in the `geographic-region`
  - [ ] See the `all antimalarial-drugs geographic-site markers` [Issue #250](https://github.com/wtchg-kwiatkowski/observatory-web/issues/250)
    - For each `all antimalarial-drugs geographic-site marker`
      - [ ] See the `antimalarial-drug-resistance-status colour-gradation` for every `antimalarial-drug` at the `geographic-site` [Issue #250](https://github.com/wtchg-kwiatkowski/observatory-web/issues/250)
      - [x] Click on the `geographic-site marker` to see a `geographic-map popup`, showing:
        - [x] the `geographic-site name`
        - [x] the `geographic-site country name`
        - [x] the `number and type of samples collected from the geographic-site`
        - [x] the `study-origin of samples collected from the geographic-site`
        - [x] the `antimalarial-drug-resistance-status colour-gradation` for every `antimalarial-drug` at the `geographic-site`
        - [x] the `geographic-site button`
          - [x] Click on the `geographic-site button` to see the `geographic-site page`
  - [x] See the `all antimalarial-drugs geographic-site marker legend`
  - [ ] See the `legend for the antimalarial-drug-resistance-status colour-gradation` [Issue #249](https://github.com/wtchg-kwiatkowski/observatory-web/issues/249)
- [x] Click on the `resistance-map button` to see the `resistance-map page`
- [x] See the `antimalarial-drug resistance in geographic-region barchart`
  - [x] See the `antimalarial-drug resistance in geographic-region barchart introduction`
  - [x] See the `antimalarial-drug resistance in geographic-region barchart total counts explanation` [Issue #297](https://github.com/wtchg-kwiatkowski/observatory-web/issues/297)
  - [x] See a `barchart bar` for every `antimalarial-drug`
  - For each `antimalarial-drug`:
    - [x] See the `predicted proportion of antimalarial-drug-resistance` for the `geographic-region`, expressed as:
      - [x] `numerator and denominator`
      - [x] `percentage`
      - [x] `barchart bar-width of total-width`
      - [x] `colour-gradation`
    - [x] Click on a `antimalarial-drug` to see the `antimalarial-drug in geographic-region page`
    - [ ] If you have a `pointer`, see the `tooltip` when you hover over the `numerator bar`, showing `predicted percentage of antimalarial-drug-resistance`
- [x] Click on the `technical document about antimalarial-drug-resistance prediction button` to see the `technical document about antimalarial-drug-resistance prediction`

### From a `antimalarial-drug in geographic-region page`
- [x] See the `antimalarial-drug in geographic-region summary`
- [x] See the `antimalarial-drug in geographic-region status`
- [x] Click on the `antimalarial-drug button` to see the `antimalarial-drug page`
- [x] See the `antimalarial-drug geographic-map`
  - [x] See the `geographic-site markers`
    - For each `geographic-site marker`
    - [x] Click on the `geographic-site marker` to see a `geographic-map popup`, showing:
      - [x] the `geographic-site name`
      - [x] the `predicted percentage of antimalarial-drug-resistance` in the `geographic-site`
      - [x] a `geographic-site button`
        - [x] Click on the `geographic-site button` to see the `geographic-site page`
  - [x] See the `geographic-region polygons`
- [x] See the `antimalarial-drug resistance by geographic-site barchart`
  - [x] See the `antimalarial-drug resistance by geographic-site barchart introduction`
  - [x] See the `antimalarial-drug resistance by geographic-site barchart total counts explanation`
  - [x] See a `barchart bar` for every `geographic-site`
  - For each `geographic-site`:
    - [x] See which `country` the `geographic-site` belongs to
    - [x] See the `predicted proportion of antimalarial-drug-resistance` for the `geographic-site`, expressed as:
      - [x] `numerator and denominator`
      - [x] `percentage`
      - [x] `barchart bar-width of total-width`
      - [x] `colour-gradation`
    - [x] Click on a `geographic-site` to see the `geographic-site page`
    - [ ] If you have a `pointer`, see the `tooltip` when you hover over the `numerator bar`, showing `predicted percentage of antimalarial-drug-resistance`
- [x] Click on the `technical document about antimalarial-drug-resistance prediction button` to see the `technical document about antimalarial-drug-resistance prediction`

____________________________________________

Components
----------

Quoted items are referred to in the **Features** section.

Items that are not quoted are only for organisational purposes, and are not actually referred to elsewhere in this document.

- user interface
  - `pointer`
  - `scroll-wheel`
  - `zoom in`
  - `zoom out`
  - `pan`
  - `enabled`
  - `disabled`
  - `search-text`
  - `new web-browser tab`
  - `internal page`
    - `page title`
    - `internal link`
  - modal-dialog
    - `modal-dialog title`
    - `modal-dialog entity-icon`
    - `modal-dialog description`
    - `cancel-and-close modal-dialog button`
  - `string of text`
  - `tooltip`
  - `navigational breadcrumb`
  - data presentation
    - barchart
      - `barchart bar`
        - `barchart bar-width of total-width`
        - `numerator bar`
    - `numerator and denominator`
    - `percentage`
    - `colour-gradation`
  - login
    - `horizontal-menu log in button`
    - `horizontal-menu log in button`
    - `log in page`
    - `hamburger-menu log out button`
    - `hamburger-menu log out button`
    - `log out page`
  - main-menu
    - `horizontal-menu buttons`
      - `horizontal-menu home button`
      - `horizontal-menu articles button`
      - `horizontal-menu analyses button`
      - `horizontal-menu data button`
    - `hamburger-menu button`
      - `hamburger-menu buttons`
  - `side-menu`
    - `collapse side-menu button`
- _webapp's home address_
- `cookies consent request`
- `cookies consent button`
- `cookies statement button`
- `MalariaGEN Analytics logo`
- `home page`
- `information about MalariaGEN Analytics and its data`
  - `about MalariaGEN Analytics button`
  - `about MalariaGEN Analytics page`
  - `about dataset button`
  - `MalariaGEN website data page`
  - `about metrics button`
  - `about MalariaGEN button`
  - `MalariaGEN website home page`
- `scientific publications and technical reports`
  - `scientific publications and technical reports button`
  - `scientific publications and technical reports page`
  - `publications/reports`
    - `publication/report button`
    - `publication/report file`
  - `technical documents`
    - `technical document`
  - `FAQs`
    - `FAQ`
- `articles`
  - `articles button`
  - `all articles button`
  - `articles page`
  - `read-more button`
  - `article page`
  - `article categories`
  - `article category checkboxes`
  - `article`
    - `article title`
    - `article author`
    - `article date`
    - `article excerpt`
    - `article featured image`
    - `article full-content`
    - `article content with separated paragraphs`
    - `article content with larger and bolder headings`
    - `article content with italics where intended`
    - `article content with images where intended`
- `analyses`
  - `analyses button`
  - `antimalarial-drugs that MalariaGEN Analytics predicts the resistance status for`
    - `list of antimalarial-drugs`
    - `antimalarial-drugs button`
    - `antimalarial-drugs page`
    - `antimalarial-drug`
      - `antimalarial-drug name`
      - `antimalarial-drug short-description`
      - `antimalarial-drug resistance description`
      - `antimalarial-drug button`
      - `antimalarial-drug page`
      - `all antimalarial-drugs map`
        - `all antimalarial-drugs map page`
        - `all antimalarial-drugs map introduction`
        - `all antimalarial-drugs geographic-site markers`
          - `all antimalarial-drugs geographic-site marker`
            - `all antimalarial-drugs geographic-site marker legend`
        - `all antimalarial-drugs map for the geographic-site`
      - `antimalarial-drug geographic-map`
        - `antimalarial-drug geographic-map introduction`
        - `antimalarial-drug geographic-map button`
        - `antimalarial-drug geographic-map page`
      - antimalarial-drug-resistance
        - `colour-gradated bar-chart of antimalarial-drug-resistance as proportion-of-samples for the the full list of geographic-regions for the antimalarial-drug`
        - `antimalarial-drug-resistance-status colour-gradation`
        - `predicted percentage of antimalarial-drug-resistance`
        - `predicted proportion of antimalarial-drug-resistance`
        - antimalarial-drug resistance in geographic-region
          - `antimalarial-drug in geographic-region summary`
          - `antimalarial-drug in geographic-region status`
          - `antimalarial-drug resistance in geographic-region button`
          - `antimalarial-drug-resistance in geographic-region page`
          - `antimalarial-drug resistance in geographic-region barchart`
            - `antimalarial-drug resistance in geographic-region barchart introduction`
            - `antimalarial-drug resistance in geographic-region barchart total counts explanation`
        - `antimalarial-drug resistance by geographic-region barchart`
          - `antimalarial-drug resistance by geographic-region barchart introduction`
          - `antimalarial-drug resistance by geographic-region barchart total counts explanation`
        - `antimalarial-drug resistance by geographic-site barchart`
          - `antimalarial-drug resistance by geographic-site barchart introduction`
          - `antimalarial-drug resistance by geographic-site barchart total counts explanation`
        - antimalarial-drug-resistance genes
          - `antimalarial-drug-resistance genes button`
          - `antimalarial-drug-resistance genes page`
            - `genes that MalariaGEN Analytics says are involved in antimalarial-drug-resistance`
          - `antimalarial-drug-resistance gene`
            - `antimalarial-drug-resistance gene short-name`
            - `antimalarial-drug-resistance gene long-name`
            - `antimalarial-drug-resistance gene short-description`
            - `antimalarial-drug-resistance gene long-description`
            - `antimalarial-drug-resistance gene button`
            - `antimalarial-drug-resistance gene page`
            - `antimalarial-drug-resistance gene variation description`
            - antimalarial-drug-resistance gene variants
              - `antimalarial-drug-resistance gene variants-table button`
              - `antimalarial-drug-resistance gene variants-table page`
              - `antimalarial-drug-resistance gene variant`
                - `antimalarial-drug-resistance gene variant amino-acid change`
                - `antimalarial-drug-resistance gene variant amino-acid position`
                - `colour-gradated antimalarial-drug-resistance gene variant non-reference allele frequency for each geographic-region`
  - `table of resistance status for the full list of antimalarial-drugs and the full list of geographic-regions`
    - `antimalarial-drug-resistance-status colour-gradated spot`
    - `legend for the antimalarial-drug-resistance-status colour-gradation`
    - `predicted percentage of antimalarial-drug-resistance in geographic-region tooltip`
  - antimalarial-drug in geographic-region
    - `antimalarial-drug in geographic-region page`
    - `antimalarial-drug in geographic-region button`
  - `geographic-regions`
    - `geographic-regions button`
    - `geographic-regions page`
    - `geographic-region selector`
    - `geographic-region polygons`
      - `geographic-region polygon`
    - `geographic-region`
      - `geographic-region name`
      - `geographic-region introduction`
    - `geographic-map`
      - `geographic-map zoom buttons`
      - `geographic-map popup`
    - `geographic-map marker`
    - `antimalarial-drug-resistance-status colour-gradated geographic-map region-polygon`
    - `geographic-site`
      - `geographic-site name`
      - `geographic-site country name`
      - `number and type of samples collected from the geographic-site`
      - `study-origin of samples collected from the geographic-site`
      - `number of studies that contributed samples at the geographic-site`
      - `geographic-site markers`
        - `geographic-site marker`
      - `geographic-site button`
      - `geographic-site page`
    - `circular geographic-marker`
      - `size relative to sample count`
- study
  - `study-origin`
  - `number and type of samples collected from the study`
  - `sample-collection date-range for the study`
  - `sample-collector names for the study`
  - `study identifier`
- `data`
  - `table`
    - `table selector`
    - `table entity-type icon`
    - `table introduction`
    - `select columns button`
    - `columns`
      - `selected columns`
      - `number-type columns`
      - `column`
        - `column headings`
        - `column labels`
        - `column label`
        - `column information icon-button`
        - `column description`
        - `column sort order`
          - `ascending order`
          - `descending order`
          - `default order`
        - `column data-type icon`
        - `column selector`
        - `other column selector`
          - `other column`
            - `other column linear coefficient`
            - `other column constant coefficient`
        - `column with categorized-values`
          - `categorized-value`
          - `categorical values`
        - `column without categorized-values`
        - `string-type column`
        - `number-type column`
      - `list of selected columns`
        - `selected column`
      - `column-selector modal-dialog`
        - `list of columns available`
          - `available column`
        - `include all columns button`
        - `exclude all columns button`
        - `apply column selection button`
    - `row`
      - `row headings`
      - `row summary tooltip`
    - `table-filter`
      - `add table-filter button`
      - `change table-filter button`
      - `construct-and-apply-table-filter modal-dialog`
        - `apply table-filter button`
        - predefined table-filters
          - `predefined table-filter`
          - `list of predefined table-filters`
        - `list of recently applied table-filters`
        - `recently applied table-filter`
        - `table-filter in construction`
          - `table-filter diagram`
            - `table-filter criteria`
              - `table-filter-criterion`
                - `table-filter-criterion editor`
                  - `add table-filter-criterion button`
                  - `add or-criterion-relationship button`
                    - `or-criterion-relationship`
                  - `add and-criterion-relationship button`
                    - `and-criterion-relationship`
                  - `delete table-filter-criterion button`
                  - `comparison operator`
                    - `comparison operator selector`
                    - `comparison-text`
                    - `other comparison-text`
                  - `value-is-equal-to-categorized-value operator`
                  - `value-is-not-equal-to-categorized-value operator`
                  - `value-is-equal-to-comparison-text operator`
                  - `value-is-not-equal-to-comparison-text operator`
                  - `value-contains-text operator`
                  - `value-does-not-contain-text operator`
                  - `value-starts-with-text operator`
                  - `value-ends-with-text operator`
                  - `value-is-empty operator`
                  - `value-is-equal-to-another-column-value`
                  - `value-is-not-equal-to-another-column-value`
                  - `value-is-less-than-text operator`
                  - `value-is-greater-than-text operator`
                  - `value-is-less-than-or-equal-to-comparison-text operator`
                  - `value-is-greater-than-or-equal-to-comparison-text operator`
                  - `value-is-between-text-and-other-text`
          - `apply table-filter button`
          - `table-filter string-representation`
            - `no-table-filter message`
        - `cancel-and-close modal-dialog button`
    - `table-data column-sort`
    - `table-data row-sort`
    - `table text-search`
      - `search-text`
      - `text-searchable columns`
    - table-data
      - `table-data values`
        - `categorical values`
        - `key internal table-data values`
          - `key internal table-data value`
        - `key external-reference-values`
          - `key external-reference-value`
      - `table-data-download button`
      - `table-data as a tab-delimited file`
      - `table-data cells`
        - `table-data cell`
        - `table-cell background-colour-gradation`
      - table-data pagination
        - `cardinal number of columns currently being shown`
        - `cardinal number of columns available to be shown`
        - `ordinal number of the first row currently being shown`
        - `ordinal number of the last row currently being shown`
        - `cardinal number of rows available to be shown`
        - `page of table-data`
        - `next page of table-data button`
        - `next page of table-data`
        - `last page of table-data button`
        - `last page of table-data`
        - `previous page of table-data button`
        - `previous page of table-data`
        - `first page of table-data button`
        - `first page of table-data`
        - `rows currently being shown`
    - `table-pivot`
      - `table-pivot button`
      - `table-pivot page`
      - `table-pivot icon`
      - `table-pivot introduction`
      - `table-pivot column-column`
        - `table-pivot column-column values as labels`
      - `table-pivot row-column`
        - `table-pivot row-column values as labels`
      - `table-pivot aggregate-type`
        - `table-pivot aggregate-type selector`
      - `table-pivot table-data`
        - `table-pivot table-data values`
        - `aggregate value`
      - `table-pivot aggregate-type counts`
        - `table-pivot count`
      - `table-pivot aggregate-type percentage-of-total`
        - `table-pivot percentage-of-total`
      - `table-pivot aggregate-type percentage-of-column-total`
        - `table-pivot percentage-of-column-total`
      - `table-pivot aggregate-type percentage-of-row-total`
        - `table-pivot percentage-of-row-total`
      - `table-pivot aggregate-type heading for all column-columns`
      - `table-pivot aggregate-type values for all column-columns`
      - `table-pivot aggregate-type heading for all row-columns`
      -  `table-pivot aggregate-type values for all row-columns`
      - `heading for the table-pivot column-columns`
      - `heading for the table-pivot row-columns`
    - `table-plot`
      - `plotly website`
      - `table-plot icon`
      - `table-plot introduction`
      - `table-plot table`
      - `random sample-subset size`
        -  `random sample-subset size selector`
      - `table-plot plot-type`
        - `table-plot plot-type selector`
        - `table-plot plot-type bar`
          - `plotted bars`
          - `plotted bar`
        - `table-plot plot-type histogram`
        - `table-plot plot-type two-dimensional-histogram`
          - `plotted areas`
          - `two-dimensional-histogram legend`
        - `table-plot plot-type box-and-whisker`
          - `plotted boxes-with-whiskers`
        - `table-plot plot-type scatter`
          - `plotted colour-coded-points`
          - `colour-coded-point legend`
      - `table-plot horizontal-axis-column selector`
        - `table-plot horizontal-axis-column value`
      - `table-plot vertical-axis-column selector`
        - `table-plot vertical-axis-column value`
      - `table-plot colour-column selector`
        - `table-plot colour-column`
      - `table-plot plot-data`
      - axes
        - `labelled axes`
        - `reset axes`
        - `auto-scale`
        - `toggle spike lines`
      - `table-plot download-as-a-png-file button`
        - `table-plot as a png file`
      - `table-plot open-and-edit-in-plotly button`
      - `table-plot zoom features`
        - `table-plot zoom-enable button`
      - `table-plot pan features`
        - `table-plot pan-enable button`
      - `table-plot auto-scale button`
      - `table-plot reset-axes button`
      - `table-plot compare-data-on-hover feature`
        - `table-plot compare-data-on-hover button`
      - `table-plot show-closest-data-on-hover feature`
        - `table-plot show-closest-data-on-hover button`
  - `data button`
  - resistance-map
    - `resistance-map button`
    - `resistance-map page`
  - samples
    - `samples-table button`
    - `samples-table page`
    - `samples-table`
  - variants
    - `variants-table button`
    - `variants-table page`
    - `variants-table`
    - `variant`
      - `variant page`
  - sites
    - `site-samples table button`
    - `site-samples table page`
  - genome
    - `genome-browser`
      - `default genome-browser state`
      - `chromosome-region being displayed`
        - `genomic position`
      - `genome-browser button`
      - `genome-browser page`
        - `genome-browser icon`
        - `genome-browser introduction`
        - `genome-browser channels`
          - `cross-channel plotted-item-value line`
          - `add genome-browser channels button`
          - `genome-browser channel`
            - `channel label`
            - `channel data-type icon`
            - `channel description`
            - `genome-browser channel-adder modal-dialog`
              - `genome-browser channel-adder search textbox`
              - `list of genome-browser channels`
              - `list of genome-browser channels to add`
              - `add list-of-genome-browser-channels button`
              - `clear list-of-genome-browser-channels button`
            - `genome-browser-channel information`
              -  `genome-browser-channel information-area`
                - `genome-browser-channel information-area icon-button`
            - `genome-browser-channel settings-area`
              - `genome-browser-channel settings-area icon-button`
              - `colour-by-column column`
                - `colour-by-column column-selector`
              - `categorical colour`
              - `distinct column values`
              - `genome-browser-channel auto-y-scale feature`
                - `genome-browser-channel auto-y-scale feature-checkbox`
                - `automatically scaled y-axis`
                - `y-axis minimum value`
                - `y-axis maximum value`
            - `close genome-browser-channel button`
            - `genome-browser channel-tracks`
              - `genome-browser-channel select genome-browser-channel-track button`
              - `genome-browser channel-track`
                - `genome-browser-channel track-items`
                - `genome-browser-channel track-area`
                - `genome-browser-channel-track data`
                - `genome-browser-channel y-axis tick-values`
                - `genome-browser track-colour`
                  - `genome-browser track-colour legend`
                  - `genome-browser track-colour colour-swatch`
                - `genome-browser-channel plotted area`
                  - `plotted points`
                  - `plotted bars` (FIXME)
                  - `plotted-item`
                    - `plotted-item value`
              - `selectable tracks`
                - `genome-browser-channel-track-selector modal-dialog`
                  - `genome-browser channel-track-selector search textbox`
                  - `list of genome-browser channel-tracks`
                    - `channel-track label`
                    - `channel-track data-type icon`
                  - `list of genome-browser channel-tracks to display`
                  - `display list-of-genome-browser-channel-tracks button`
                  - `clear list-of-genome-browser-channel-tracks button`
        - `genome-browser chromosome selector`
        - `genome-browser chromosome`
          -  `genome-browser chromosome being displayed`
        - `genome-browser region`
          - `genome-browser chromosome-region being displayed`
            - `genome-browser base-position-midpoint of the chromosome-region being displayed`
            - `genome-browser width-in-base-positions of the chromosome-region being displayed`
            - `genome-browser base-position-ticks of the chromosome-region being displayed`
        - genome-browser reference-sequence
          - `genome-browser reference-sequence channel`
            - `genome-browser reference-sequence being displayed`
          - `genome-browser reference-sequence summarized-base-colours`
          - `genome-browser reference-sequence base-letters`
          - `genome-browser reference-sequence base-colours`
            - `genome-browser reference-sequence base-colours legend`
          - `genome-browser reference-sequence display-sequence button`
        - genome-browser genes
          - `genome-browser genes channel`
            - `genome-browser genes-channel gene legend`
            - `genome-browser genes-channel gene`
            - `genome-browser genes-channel gene coding-sequence regions`
            - `gene`
        - `genome-browser variants channel`
          - `genome-browser variants-channel track-item`
        - `genome-browser global-fst-variant channel`
  - documents
    - `technical document about antimalarial-drug-resistance prediction button`
    - `technical document about antimalarial-drug-resistance prediction`