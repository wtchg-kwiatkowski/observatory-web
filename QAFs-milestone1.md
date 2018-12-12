DRAFT

TODO: resolve all intended-but-not-QA'd features (marked as `[ ]`), and answer all queries (marked as `??`)

Currently based on pre-milestone1 sub-versions:
- Panoptes core: observatory branch, commit 36528d61900862577d112ca82aa6ff0b6340c775
- Observatory-web configuration: master branch, commit 979366877bcd411881d4cdc43a0483544fcbb68e

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
- 595 quality-assured desktop-and-tablet features
- 341 quality-assured pocket-friendly features
- 109 flawed desktop-and-tablet features
- 207 features have pocket-problems
- 205 noted issues (includes duplicates)
- 704 total feature count (QA'd + flawed)

### About the scope
Administrative features are considered out-of-scope for this document. (See the QAFs for the Panopte core software for that.)

### About the "checkboxes" and "issues"
- [x] Checked items have been checked by a designated human, and found to be satisfactory.
- [ ] Unchecked items are supposed to work, but either they haven't been checked yet, or they have known issues. Known issues should be noted next to each unchecked item.

If a parent checkbox is checked (QA'd), then this does not necessarily mean that all of its child checkboxes are also checked (QA'd) because the parent-child relationship is merely based on organisational convenience rather than strict functional dependence.
If a parent feature has an issue, then this often implies that the same issue affects some (or all) of the child features. To minimize duplicate issue counts in the summary figures, **do not** repeat the issue note for child features.

### About the pocket-friendliness
- (pocket-friendly) after the checkbox indicates that the feature has been checked by a designated human, and found to be satisfactory for high-end pocket-sized touch-screen mobile devices in portrait-orientation.
- (pocket-problems) before the issue notes indicates that the feature has known issues on high-end pocket-sized touch-screen mobile devices in portrait-orientation. Known issues should be noted next to each item.

Some features might not be relevant to pocket-friendliness, in which case no indication is made. However, this might alternatively mean that the compatibility status has not been determined for that feature.
If a parent feature has been marked as pocket-friendly or as having pocket-problems, then this implies that the same might apply to some (or all) of the child features. To maximize the correlation between summary figures for pocket-friendly features and desktop/tablet features, **repeat** the compatibility status indication for every relevant child feature, but do not repeat the issue note (to minimize duplicate issue counts), instead use a "^" symbol.
If the feature has desktop-and-tablet issues, i.e. if the checkbox is unchecked, then there should be no indication of pocket-friendliness, but if there are specific issues relating to pocket-compatibility it should be marked as having pocket-problems.

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
  - [x] (pocket-friendly) 26 Mbps download speed (UK average[^1])
  - [x] (pocket-friendly) 11 Mbps upload speed (UK average[^1])
- CPU
  - [x] 3.40GHz x 8
- RAM
  - [x] 15.6 GiB

[^1]: http://www.speedtest.net/reports/united-kingdom/ "Q3–Q4 2017"


### Client operating systems and web browsers:
- Desktop and laptop
  - Canonical Ubuntu 18.04.1 (Bionic Beaver)
    - [x] Google Chrome 70
    - [x] Mozilla Firefox 63
  - Canonical Ubuntu 16.04.5 LTS (Xenial Xerus)
    - [x] Google Chrome 70
    - [x] Mozilla Firefox 63
  - Microsoft Windows 10
    - [x] Google Chrome 70
    - [x] Mozilla Firefox 63
    - [ ] Microsoft Edge 42
  - Apple macOS 10.12
    - [ ] Apple Safari v12
    - [x] Google Chrome 70
    - [x] Mozilla Firefox 63
- Tablet and mobile
  - Apple iOS 12
    - [x] (pocket-friendly) Apple Safari v12
    - [x] (pocket-friendly) Google Chrome 70

____________________________________________

Features
--------

Variables:
- The _webapp's home address_ might be:
  - Local development: `http://localhost:8080/analytics`
  - Staging: `http://foo.bar/analytics`
  - Production: `https://www.malariagen.net/analytics`
- The _top-horizontal-menu break-point pixel-width_ is currently hard-coded to 1200 pixels via custom component file `page-template.scss`
- The _table-data page-rows-size_ is currently set to 250 rows via Panoptes core file `components/containers/DataTableWithActions.js` (default value, can be overridden)

Terminology:
- "button" is interchangeable with "link"
- "click" is interchangeable with the "tap" action on touch-screen devices

The use of a control implies that the control itself can be seen, and that the specified effect of its use also occurs. For example, "Click on the red button to see the green box" implies that a red button can be seen, and can be clicked on, and that clicking on that red button causes a green box to become visible. If the control cannot be seen, or clicked on, or if no green box becomes visible after clicking on it, then that feature is deemed to have failed QA (and the issue should be noted).

For the compatible platforms, the following features of the specified release have been verified.

As an end-user of the software, you can:

### From anywhere with a compatible internet connection
- [x] (pocket-friendly) Visit the _webapp's home address_ using a compatible web browser to see the webapp's `home page` with no critical errors (e.g. 404)
- If cookies or state have not been set, e.g. `first-visit` or `refreshed-after-cookies-refused`:
  - [x] Click on the `cookies consent button` to hide the `cookie consent request` (pocket-problems) [observatory-web issue #427](https://github.com/wtchg-kwiatkowski/observatory-web/issues/427)
  - [x] (pocket-friendly) Don't see the `cookies consent request` after previously clicking on the `cookies consent button` and reloading the page with normal settings.
  - [x] (pocket-friendly) Click on the `cookies statement button` to see the `cookies statement`

### From anywhere in the webapp
- [x] (pocket-friendly) Click on the `MalariaGEN Analytics logo` to see the webapp's `home page`
- [x] (pocket-friendly) If your viewport > _top-horizontal-menu break-point pixel-width_, see the `top-horizontal-menu buttons`
- For viewports < _top-horizontal-menu break-point pixel-width_:
  - [x] (pocket-friendly) Click on the `hamburger-menu button` to see the `hamburger-menu buttons`
    - [x] (pocket-friendly) Click on the `hamburger-menu home button` to see the `home page`
    - [x] (pocket-friendly) Click on the `hamburger-menu articles button` to see the `articles page`
    - [x] (pocket-friendly) Click on the `hamburger-menu analyses button` to see the `analyses page`
      - [x] (pocket-friendly) Click on the `hamburger-menu drug-resistance-in-pf button` to see the `drug-resistance-in-pf page`
        - [x] (pocket-friendly) Click on the `hamburger-menu pf-antimalarial-drugs button` to see the `pf-antimalarial-drugs page`
        - [x] (pocket-friendly) Click on the `hamburger-menu pf-rdt-evasion button` to see the `pf-rdt-evasion page`
        - [x] (pocket-friendly) Click on the `hamburger-menu pf-geographic-regions button` to see the `pf-geographic-regions page`
        - [x] (pocket-friendly) Click on the `hamburger-menu pf-resistance-genes button` to see the `pf-resistance-genes page`
        - [x] (pocket-friendly) Click on the `hamburger-menu pf-resistance-map button` to see the `pf-resistance-map page`
    - [x] (pocket-friendly) Click on the `hamburger-menu data button` to see the `data page`
      - [x] (pocket-friendly) Click on the `hamburger-menu pf6-release button` to see the `pf6-release page`
        - [ ] (pocket-friendly) Click on the `hamburger-menu pf6-sample-table button` to see the `pf6-sample-table page` [panoptes issue #1195](https://github.com/cggh/panoptes/issues/1195)
        - [ ] (pocket-friendly) Click on the `hamburger-menu pf6-variants-table button` to see the `pf6-variants-table page` [panoptes issue #1195](https://github.com/cggh/panoptes/issues/1195)
- For viewports >= _top-horizontal-menu break-point pixel-width_:
  - [x] Click on the `top-horizontal-menu home button` to see the `home page`
  - [x] Click on the `top-horizontal-menu articles button` to see the `articles page`
  - [x] Click on the `top-horizontal-menu analyses button` to see the `analyses top-horizontal-submenu`
    - [x] Click on the `analyses top-horizontal-submenu drug-resistance-in-pf button` to see the `drug-resistance-in-pf page`
      - [x] Click on the `analyses top-horizontal-submenu pf-antimalarial-drugs button` to see the `pf-antimalarial-drugs page`
      - [ ] Click on the `analyses top-horizontal-submenu pf-rdt-evasion button` to see the `pf-rdt-evasion page`
      - [x] Click on the `analyses top-horizontal-submenu pf-geographic-regions button` to see the `pf-geographic-regions page`
      - [x] Click on the `analyses top-horizontal-submenu pf-resistance-genes button` to see the `pf-resistance-genes page`
      - [x] Click on the `analyses top-horizontal-submenu pf-resistance-map button` to see the `pf-resistance-map page`
  - [x] Click on the `top-horizontal-menu data button` to see the `data top-horizontal-submenu`
    - [x] Click on the `data top-horizontal-submenu pf6-release button` to see the `pf6-release page`
    - [ ] Click on the `data top-horizontal-submenu pf6-sample-table button` to see the `pf6-sample-table page` [panoptes issue #1195](https://github.com/cggh/panoptes/issues/1195)
    - [ ] Click on the `data top-horizontal-submenu pf6-sample-table button` to see the `pf6-sample-table page` [panoptes issue #1195](https://github.com/cggh/panoptes/issues/1195)
- [ ] Except from the `home page`, see the `navigational breadcrumb` [observatory-web issue #424](https://github.com/wtchg-kwiatkowski/observatory-web/issues/424)
  - [ ] Use the `navigational breadcrumb` to see your current position in the page hierarchy [observatory-web issue #424](https://github.com/wtchg-kwiatkowski/observatory-web/issues/424)
  - [ ] Use the `navigational breadcrumb` to navigate to parent pages [observatory-web issue #424](https://github.com/wtchg-kwiatkowski/observatory-web/issues/424)
- [ ] See the `footer` [observatory-web issue #447](https://github.com/wtchg-kwiatkowski/observatory-web/issues/447)
  - [ ] Click on the `footer about button` to see the `about MalariaGEN Analytics page` [observatory-web issue #372](https://github.com/wtchg-kwiatkowski/observatory-web/issues/372)
  - [ ] Click on the `footer cookies button` to see the `cookies statement` [observatory-web issue #372](https://github.com/wtchg-kwiatkowski/observatory-web/issues/372)
  - [ ] See the `footer data-last-updated date` [observatory-web issue #372](https://github.com/wtchg-kwiatkowski/observatory-web/issues/372)

### From the `about MalariaGEN Analytics page`
- [x] (pocket-friendly) Click on the `about dataset button` to go to the `MalariaGEN website data page`
- [x] (pocket-friendly) Click on the `about metrics button` to see the scientific publications and technical reports page`
- [ ] Click on the `about webapps button` to see the `?? page` [observatory-web issue #294](https://github.com/wtchg-kwiatkowski/observatory-web/issues/294)
- [x] (pocket-friendly) Click on the `about MalariaGEN button` to go to the `MalariaGEN website home page`
- [x] (pocket-friendly) Click on the `scientific publications and technical reports button` to see the `scientific publications and technical reports page`
- [x] (pocket-friendly) See the `MalariaGEN Analytics contact details`

### From the `scientific publications and technical reports page`
- [ ] See the `navigational breadcrumb` [observatory-web issue #295](https://github.com/wtchg-kwiatkowski/observatory-web/issues/295)
- [ ] See a `page title` [observatory-web issue #295](https://github.com/wtchg-kwiatkowski/observatory-web/issues/295)
- [ ] See a summary of the `scientific publications and technical reports` [observatory-web issue #295](https://github.com/wtchg-kwiatkowski/observatory-web/issues/295)
- [ ] Click on the `pf6-report button` to see the `pf6-report page` [observatory-web issue #295](https://github.com/wtchg-kwiatkowski/observatory-web/issues/295)
- [x] (pocket-friendly) Click on the `technical details about antimalarial-resistance prediction button` to download the `technical details about antimalarial-resistance prediction page`


### From the `home page`

#### Access `articles`
- [x] See the 3 most recent `article-list-items` (pocket-problems) [observatory-web issue #444](https://github.com/wtchg-kwiatkowski/observatory-web/issues/444)
  - For each `article-list-item`:
    - [x] (pocket-friendly) See the `article title`
    - [x] (pocket-friendly) See the `article author`
    - [x] (pocket-friendly) See the `article date`
    - [ ] See the `article excerpt` [observatory-web issue #406](https://github.com/wtchg-kwiatkowski/observatory-web/issues/406)
    - [ ] Click on the `read-more button` to see that `article page` [observatory-web issue #443](https://github.com/wtchg-kwiatkowski/observatory-web/issues/443)
  - [x] (pocket-friendly) If the `article` has a featured image, see the `article featured image`
- [ ] Click on the `all articles button` to see the `articles page` [observatory-web issue #407](https://github.com/wtchg-kwiatkowski/observatory-web/issues/407)

#### Access `analyses`
- [x] (pocket-friendly) See a summary of the `analyses`
- [x] (pocket-friendly) Click on the `pf-antimalarial-drugs button` to see the `pf-antimalarial-drugs page`
- [x] (pocket-friendly) Click on the `pf-rdt-evasion button` to see the `pf-rdt-evasion page`
- [x] (pocket-friendly) Click on the `pf-geographical-regions button` to see the `pf-geographical-regions page`
- [x] (pocket-friendly) Click on the `pf-antimalarial-drug resistance genes button` to see the `pf-antimalarial-drug resistance genes page`
- [x] (pocket-friendly) Click on the `pf-resistance-map button` to see the `pf-resistance-map page`

#### Access `data`
- [x] (pocket-friendly) See a summary of the `data`
- [x] (pocket-friendly) Click on the `samples-table button` to see the `samples-table page`
- [x] (pocket-friendly) Click on the `variants-table button` to see the `variants-table page`
- [ ] Click on the `genome-browser button` to see the `genome-browser page`

### From the `articles page`
- [ ] Toggle the `article category checkboxes` to see only the `articles` that are in the checked `article categories` [observatory-web issue #288](https://github.com/wtchg-kwiatkowski/observatory-web/issues/288) [observatory-web issue #410](https://github.com/wtchg-kwiatkowski/observatory-web/issues/410)
- [ ] See the `list of article-list-items` (pocket-problems) [observatory-web issue #426](https://github.com/wtchg-kwiatkowski/observatory-web/issues/426) [observatory-web issue #444](https://github.com/wtchg-kwiatkowski/observatory-web/issues/444)
  - For each `article-list-item`:
    - [x] (pocket-friendly) See the `article title`
    - [x] (pocket-friendly) See the `article author`
    - [x] (pocket-friendly) See the `article date`
    - [ ] See the `article excerpt` [observatory-web issue #406](https://github.com/wtchg-kwiatkowski/observatory-web/issues/406)
    - [ ] See the `article categories` [observatory-web issue #288](https://github.com/wtchg-kwiatkowski/observatory-web/issues/288)
    - [ ] Click on the `read-more button` to see that `article page` [observatory-web issue #443](https://github.com/wtchg-kwiatkowski/observatory-web/issues/443)
- [x] (pocket-friendly) See the `article featured image` for at least one `article`

### From an `article page`
- [x] (pocket-friendly) See the `article title`
- [x] (pocket-friendly) See the `article author`
- [x] (pocket-friendly) See the `article date`
- [x] (pocket-friendly) See `article featured image`
- [x] (pocket-friendly) See the `article full-content`
  - [x] (pocket-friendly) See `article content with separated paragraphs`
  - [x] (pocket-friendly) See `article content with larger and bolder headings`
  - [x] (pocket-friendly) See `article content with italics where intended`
  - [x] (pocket-friendly) See `article content with images where intended`
  - [x] (pocket-friendly) See `article dynamic content as intended`
- [ ] Click on any `internal link` to see the corresponding `internal page` [observatory-web issue #292](https://github.com/wtchg-kwiatkowski/observatory-web/issues/292)

### From the `analyses page`
- [x] (pocket-friendly) See content that is consistent with the `home page`
- [x] (pocket-friendly) See a summary of the `analyses`
- [x] (pocket-friendly) Click on the `pf-antimalarial-drugs button` to see the `pf-antimalarial-drugs page`
- [x] (pocket-friendly) Click on the `pf-antimalarial-drug resistance genes button` to see the `pf-antimalarial-drug resistance genes page`
- [x] (pocket-friendly) Click on the `pf-rdt-evasion button` to see the `pf-rdt-evasion page`
- [x] (pocket-friendly) Click on the `pf-geographical-regions button` to see the `pf-geographical-regions page`
- [x] (pocket-friendly) Click on the `pf-resistance-map button` to see the `pf-resistance-map page`

### From the `data page`
- [ ] See content that is consistent with the `home page`
- [x] (pocket-friendly) See a summary of the `data`
- [x] (pocket-friendly) Click on the `samples-table button` to see the `samples-table page`
- [x] (pocket-friendly) Click on the `variants-table button` to see the `variants-table page`
- [x] (pocket-friendly) Click on the `genome-browser button` to see the `genome-browser page`

### From the `pf-antimalarial-drugs page`
- [x] (pocket-friendly) See the `antimalarial-drugs that MalariaGEN Analytics predicts the resistance status for`
  - For each `antimalarial-drug`:
    - [x] (pocket-friendly) See the `antimalarial-drug name`
    - [x] (pocket-friendly) See the `antimalarial-drug short-description`
    - [x] (pocket-friendly) Click on the `antimalarial-drug button` to see that `antimalarial-drug page`
- [x] See the `table of resistance statuses for the full list of antimalarial-drugs and the full list of geographic-regions` (pocket-problems) [observatory-web issue #431](https://github.com/wtchg-kwiatkowski/observatory-web/issues/431)
  - For each combination of `antimalarial-drug` and `geographic-region`:
    - [x] (pocket-friendly) See the `antimalarial-drug resistance-status colour-gradated spot`
    - [x] If you have a `pointer`, see the `predicted percentage of antimalarial-drug resistance in geographic-region tooltip` when you hover over the `antimalarial-drug resistance-status colour-gradated spot` 
    - [x] (pocket-friendly) Click on the `antimalarial-drug resistance-status colour-gradated spot` to see the `antimalarial-drug in geographic-region page`
  - [x] See the `legend for the antimalarial-drug resistance-status colour-gradation` (pocket-problems) [observatory-web issue #432](https://github.com/wtchg-kwiatkowski/observatory-web/issues/432)
- [x] (pocket-friendly) See the `combination-therapies that MalariaGEN Analytics predicts the resistance status for`
  - For each `combination-therapy`:
    - [x] (pocket-friendly) See the `combination-therapy name`
    - [x] (pocket-friendly) ee the `combination-therapy short-description`
    - [x] (pocket-friendly) Click on the `combination-therapy button` to see that `combination-therapy page`
- [x] See the `table of resistance statuses for the full list of combination-therapies and the full list of geographic-regions` (pocket-problems) [observatory-web issue #431](https://github.com/wtchg-kwiatkowski/observatory-web/issues/431)
  - For each combination of `combination-therapy` and `geographic-region`:
    - [x] (pocket-friendly) See the `combination-therapy-resistance-status colour-gradated spot`
    - [x] If you have a `pointer`, see the `predicted percentage of combination-therapy-resistance in geographic-region tooltip` when you hover over the `combination-therapy-resistance-status colour-gradated spot`
    - [x] (pocket-friendly) Click on the `combination-therapy-resistance-status colour-gradated spot` to see the `combination-therapy in geographic-region page`
  - [x] See the `legend for the combination-therapy-resistance-status colour-gradation` (pocket-problems) [observatory-web issue #432](https://github.com/wtchg-kwiatkowski/observatory-web/issues/432)
- [x] (pocket-friendly) Click on the `technical details about antimalarial-resistance prediction button` to see the `technical details about antimalarial-resistance prediction page`

### From the `technical details about antimalarial-resistance prediction page`
- [x] See the `antimalarial-resistance prediction introduction` (pocket-problems) [observatory-web issue #437](https://github.com/wtchg-kwiatkowski/observatory-web/issues/437)
- For each `antimalarial-drug`:
  - [x] See the `antimalarial-drug name` (pocket-problems) ^
  - [x] See the `antimalarial-drug resistance genes` (pocket-problems) ^
    - For each `antimalarial-drug resistance gene`:
      - [x] See the `antimalarial-drug resistance gene short-name` (pocket-problems) ^
      - [x] If there are any, see the `antimalarial-drug resistance gene alias-names` (pocket-problems) ^
      - [x] See the `antimalarial-drug resistance gene codon-positions` (pocket-problems) ^
      - [x] See the `antimalarial-drug resistance gene table` (pocket-problems) ^
        - [x] See the `antimalarial-drug resistance gene amino-acid changes, interpretations and phenotypes` (pocket-problems) ^
        - [x] See `notes for the antimalarial-drug resistance gene table` (pocket-problems) ^
        - [x] See `references for the antimalarial-drug resistance gene table` (pocket-problems) ^
- For each `combination-therapy`:
  - [x] See the `combination-therapy name` (pocket-problems) ^
  - [x] See the `combination-therapy resistance genes` (pocket-problems) ^
    - For each `combination-therapy resistance gene`:
      - [x] See the `combination-therapy resistance gene short-name` (pocket-problems) ^
      - [x] If there are any, see the `combination-therapy resistance gene alias-names` (pocket-problems) ^
      - [x] See the `combination-therapy resistance gene codon-positions` (pocket-problems) ^
      - [x] See the `combination-therapy resistance gene table` (pocket-problems) ^
        - [x] See the `combination-therapy resistance gene amino-acid changes, interpretations and phenotypes` (pocket-problems) ^
        - [x] See `notes for the combination-therapy resistance gene table` (pocket-problems) ^
        - [x] See `references for the combination-therapy resistance gene table` (pocket-problems) ^

### From an `antimalarial-drug page`
- [x] (pocket-friendly) See the `antimalarial-drug name`
- [x] (pocket-friendly) See the `antimalarial-drug resistance description`
- For each `antimalarial-drug resistance gene` associated with the `antimalarial-drug`:
  - [x] (pocket-friendly) Click on the `antimalarial-drug resistance gene button` to see the `antimalarial-drug resistance gene page`
- [x] (pocket-friendly) See a `geographic-map`
  - [x] See the `legend for the antimalarial-drug resistance-status colour-gradation` (pocket-problems) [observatory-web issue #432](https://github.com/wtchg-kwiatkowski/observatory-web/issues/432)
    - For each `geographic-site`:
      - [x] (pocket-friendly) See a `circular geographic-marker` for the `geographic-site` that has:
        - [x] (pocket-friendly) `antimalarial-drug resistance-status colour-gradation`
        - [x] (pocket-friendly) `size relative to sample count`
        - [x] If you have a `pointer`, see the `tooltip` when you hover over the `circular geographic-marker`, showing `predicted percentage of antimalarial-drug resistance`
        - [x] Click on the `circular geographic-marker` to see: (pocket-problems) [observatory-web issue #442](https://github.com/wtchg-kwiatkowski/observatory-web/issues/442)
          - [x] the `predicted percentage of antimalarial-drug resistance` (pocket-problems) ^
          - [x] the `geographic-site button` (pocket-problems) ^
            - [x] Click on the `geographic-site button` to see the `geographic-site page` (pocket-problems) ^
  - [x] Drag on the `geographic-map` to pan left, right, up and down (pocket-problems) [observatory-web issue #449](https://github.com/wtchg-kwiatkowski/observatory-web/issues/449)
  - [ ] Click on the `geographic-map zoom buttons` to zoom in and out (pocket-problems) [observatory-web issue #449](https://github.com/wtchg-kwiatkowski/observatory-web/issues/449)
  - [x] If you have a `pointer` and a `scroll-wheel`, scroll up and down while hovering over the `geographic-map` to zoom in and out
  - [x] (pocket-friendly) Click on the `antimalarial-drug geographic-map button` to see the `antimalarial-drug geographic-map page` for the `antimalarial-drug`
- [x] See the `antimalarial-drug resistance by geographic-region barchart` (pocket-problems) [observatory-web issue #435](https://github.com/wtchg-kwiatkowski/observatory-web/issues/435)
  - [x] (pocket-friendly) See the `antimalarial-drug resistance by geographic-region barchart introduction`
  - [x] (pocket-friendly) See the `antimalarial-drug resistance by geographic-region barchart total counts explanation`
  - [x] (pocket-friendly) See a `barchart bar` for every `geographic-region`
    - For each `geographic-region`:
      - See the `predicted proportion of antimalarial-drug resistance` for that `geographic-region`, expressed as:
        - [x] (pocket-friendly) `numerator and denominator`
        - [x] (pocket-friendly) `percentage`
        - [x] (pocket-friendly) `barchart bar-width of total-width`
        - [x] (pocket-friendly) `colour-gradation`
      - [x] (pocket-friendly) Click on a `geographic-region` to see the `antimalarial-drug resistance in geographic-region page`
      - [x] If you have a `pointer`, see the `tooltip` when you hover over the `numerator bar`, showing `predicted percentage of antimalarial-drug resistance`
- [x] (pocket-friendly) Click on the `technical details about antimalarial-resistance prediction button` to see the `technical details about antimalarial-resistance prediction page`

### From a `combination-therapy page`
- [x] (pocket-friendly) See the `combination-therapy name`
- [x] (pocket-friendly) See the `combination-therapy resistance description`
- For each `combination-therapy resistance gene` associated with the `combination-therapy`:
  - [ ] Click on the `combination-therapy resistance gene button` to see the `combination-therapy-resistance gene page` [observatory-web issue #408](https://github.com/wtchg-kwiatkowski/observatory-web/issues/408)
- [x] See a `geographic-map`
  - [x] See the `legend for the combination-therapy-resistance-status colour-gradation` (pocket-problems) [observatory-web issue #432](https://github.com/wtchg-kwiatkowski/observatory-web/issues/432)
    - For each `geographic-site`:
      - [x] (pocket-friendly) See a `circular geographic-marker` for the `geographic-site` that has:
        - [x] (pocket-friendly) `combination-therapy-resistance-status colour-gradation`
        - [x] (pocket-friendly) `size relative to sample count`
        - [x] If you have a `pointer`, see the `tooltip` when you hover over the `circular geographic-marker`, showing `predicted percentage of combination-therapy-resistance`
        - [x] Click on the `circular geographic-marker` to see: (pocket-problems) [observatory-web issue #442](https://github.com/wtchg-kwiatkowski/observatory-web/issues/442)
          - [x] the `predicted percentage of combination-therapy-resistance` (pocket-problems) ^
          - [x] the `geographic-site button` (pocket-problems) ^
            - [x] Click on the `geographic-site button` to see the `geographic-site page` (pocket-problems) ^
  - [x] Drag on the `geographic-map` to pan left, right, up and down (pocket-problems) [observatory-web issue #449](https://github.com/wtchg-kwiatkowski/observatory-web/issues/449)
  - [ ] Click on the `geographic-map zoom buttons` to zoom in and out (pocket-problems) [observatory-web issue #449](https://github.com/wtchg-kwiatkowski/observatory-web/issues/449)
  - [x] If you have a `pointer` and a `scroll-wheel`, scroll up and down while hovering over the `geographic-map` to zoom in and out
  - [x] (pocket-friendly) Click on the `combination-therapy geographic-map button` to see the `combination-therapy geographic-map page` for the `combination-therapy`
- [x] See the `combination-therapy resistance by geographic-region barchart` (pocket-problems) [observatory-web issue #435](https://github.com/wtchg-kwiatkowski/observatory-web/issues/435)
  - [x] (pocket-friendly) See the `combination-therapy resistance by geographic-region barchart introduction`
  - [x] (pocket-friendly) See the `combination-therapy resistance by geographic-region barchart total counts explanation`
  - [x] (pocket-friendly) See a `barchart bar` for every `geographic-region`
  - For each `geographic-region`:
    - See the `predicted proportion of combination-therapy-resistance` for that `geographic-region`, expressed as:
      - [x] (pocket-friendly) `numerator and denominator`
      - [x] (pocket-friendly) `percentage`
      - [x] (pocket-friendly) `barchart bar-width of total-width`
      - [x] (pocket-friendly) `colour-gradation`
    - [x] (pocket-friendly) Click on a `geographic-region` to see the `combination-therapy-resistance in geographic-region page`
    - [x] If you have a `pointer`, see the `tooltip` when you hover over the `numerator bar`, showing `predicted percentage of combination-therapy-resistance`
- [x] (pocket-friendly) Click on the `technical details about antimalarial-resistance prediction button` to see the `technical details about antimalarial-resistance prediction page`

### From the `pf-rdt-evasion page`
- [x] See the `pf-rdt-evasion introduction` (pocket-problems) [observatory-web issue #445](https://github.com/wtchg-kwiatkowski/observatory-web/issues/445)
- [x] See the `table of pf-rdt-evasion statuses for the full list of evasion gene-sets and the full list of geographic-regions` (pocket-problems) [observatory-web issue #431](https://github.com/wtchg-kwiatkowski/observatory-web/issues/431)
  - For each combination of `evasion gene-set` and `geographic-region`:
    - [x] (pocket-friendly) See the `pf-rdt-evasion colour-gradated spot`
    - [x] If you have a `pointer`, see the `predicted percentage of pf-rdt-evasion` when you hover over the `pf-rdt-evasion colour-gradated spot`
- [x] See a `geographic-map`
  - [x] See the `legend for the pf-rdt-evasion-status colour-gradation` (pocket-problems) [observatory-web issue #432](https://github.com/wtchg-kwiatkowski/observatory-web/issues/432)
    - For each `geographic-site`:
      - [x] (pocket-friendly) See a `circular geographic-marker` for the `geographic-site` that has:
        - [x] (pocket-friendly) `pf-rdt-evasion-status colour-gradation`
        - [x] (pocket-friendly) `size relative to sample count`
        - [x] If you have a `pointer`, see the `tooltip` when you hover over the `circular geographic-marker`, showing `predicted percentage of pf-rdt-evasion`
        - [x] Click on the `circular geographic-marker` to see: (pocket-problems) [observatory-web issue #442](https://github.com/wtchg-kwiatkowski/observatory-web/issues/442)
          - [x] the `predicted percentage of pf-rdt-evasion` (pocket-problems) ^
          - [x] the `geographic-site button` (pocket-problems) ^
            - [x] Click on the `geographic-site button` to see the `geographic-site page` (pocket-problems) ^
  - [x] Drag on the `geographic-map` to pan left, right, up and down (pocket-problems) [observatory-web issue #449](https://github.com/wtchg-kwiatkowski/observatory-web/issues/449)
  - [ ] Click on the `geographic-map zoom buttons` to zoom in and out (pocket-problems) [observatory-web issue #449](https://github.com/wtchg-kwiatkowski/observatory-web/issues/449)
  - [x] If you have a `pointer` and a `scroll-wheel`, scroll up and down while hovering over the `geographic-map` to zoom in and out

### From the `geographic-regions page`
- [x] Select a `geographic-region` from the `geographic-region selector` to see that `geographic-region page` (pocket-problems) [observatory-web issue #428](https://github.com/wtchg-kwiatkowski/observatory-web/issues/428)
- See a `geographic-map`:
  - [x] Click on a `geographic-region` to see that `geographic-region page` (pocket-problems) [observatory-web issue #428](https://github.com/wtchg-kwiatkowski/observatory-web/issues/428)
- [x] Click on the `pf-resistance-map button` to see the `pf-resistance-map page` (pocket-problems) [observatory-web issue #428](https://github.com/wtchg-kwiatkowski/observatory-web/issues/428)
- [x] See the `table of resistance statuses for the full list of antimalarial-drugs and the full list of geographic-regions` (pocket-problems) [observatory-web issue #428](https://github.com/wtchg-kwiatkowski/observatory-web/issues/428)
  - For each combination of `antimalarial-drug` and `geographic-region`:
    - [x] See the `antimalarial-drug resistance-status colour-gradated spot` (pocket-problems) ^
    - [x] If you have a `pointer`, see the `predicted percentage of antimalarial-drug resistance in geographic-region tooltip` when you hover over the `antimalarial-drug resistance-status colour-gradated spot`
    - [x] Click on the `antimalarial-drug resistance-status colour-gradated spot` to see the `antimalarial-drug in geographic-region page` (pocket-problems) ^
  - [x] See the `legend for the antimalarial-drug resistance-status colour-gradation` (pocket-problems) ^

### From a `geographic-region page`
- [x] (pocket-friendly) See the `geographic-region name`
- [x] (pocket-friendly) See the `geographic-region introduction`
- [x] (pocket-friendly) See a `geographic-map` with a `geographic-map marker` for each `sample site` in the `geographic-region`
  - [ ] See the `all antimalarial-drugs geographic-site markers` [observatory-web issue #250](https://github.com/wtchg-kwiatkowski/observatory-web/issues/250)
    - For each `all antimalarial-drugs geographic-site marker`:
      - [ ] See the `antimalarial-drug resistance-status colour-gradation` for every `antimalarial-drug` at the `geographic-site` [observatory-web issue #250](https://github.com/wtchg-kwiatkowski/observatory-web/issues/250)
      - [x] Click on the `geographic-site marker` to see a `geographic-map popup`, showing: [observatory-web issue #442](https://github.com/wtchg-kwiatkowski/observatory-web/issues/442)
        - [x] the `geographic-site name` (pocket-problems) ^
        - [x] the `geographic-site country name` (pocket-problems) ^
        - [x] the `number and type of samples collected from the geographic-site` (pocket-problems) ^
        - [x] the `study-origin of samples collected from the geographic-site` (pocket-problems) ^
        - [x] the `antimalarial-drug resistance-status colour-gradation` for every `antimalarial-drug` at the `geographic-site` (pocket-problems) ^
        - [x] the `geographic-site button` (pocket-problems) ^
          - [x] Click on the `geographic-site button` to see the `geographic-site page` (pocket-problems) ^
  - [x] (pocket-friendly) See the `all antimalarial-drugs geographic-site marker legend`
  - [x] See the `legend for the antimalarial-drug resistance-status colour-gradation` (pocket-problems) [observatory-web issue #432](https://github.com/wtchg-kwiatkowski/observatory-web/issues/432)
- [x] (pocket-friendly) Click on the `pf-resistance-map button` to see the `pf-resistance-map page`
- [x] See the `antimalarial-drug resistance in geographic-region barchart` (pocket-problems) [observatory-web issue #435](https://github.com/wtchg-kwiatkowski/observatory-web/issues/435)
  - [x] (pocket-friendly) See the `antimalarial-drug resistance in geographic-region barchart introduction`
  - [x] (pocket-friendly) See the `antimalarial-drug resistance in geographic-region barchart total counts explanation`
  - [x] (pocket-friendly) See a `barchart bar` for every `antimalarial-drug`
    - For each `antimalarial-drug`:
      - See the `predicted proportion of antimalarial-drug resistance` for the `geographic-region`, expressed as:
        - [x] (pocket-friendly) `numerator and denominator`
        - [x] (pocket-friendly) `percentage`
        - [x] (pocket-friendly) `barchart bar-width of total-width`
        - [x] (pocket-friendly) `colour-gradation`
      - [x] (pocket-friendly) Click on an `antimalarial-drug` to see the `antimalarial-drug in geographic-region page`
      - [x] If you have a `pointer`, see the `tooltip` when you hover over the `numerator bar`, showing `predicted percentage of antimalarial-drug resistance`
- [x] See the `combination-therapy resistance in geographic-region barchart` (pocket-problems) [observatory-web issue #435](https://github.com/wtchg-kwiatkowski/observatory-web/issues/435)
  - [x] (pocket-friendly) See the `combination-therapy resistance in geographic-region barchart introduction`
  - [x] (pocket-friendly) See the `combination-therapy resistance in geographic-region barchart total counts explanation`
  - [x] (pocket-friendly) See a `barchart bar` for every `combination-therapy`
    - For each `combination-therapy`:
      - See the `predicted proportion of combination-therapy-resistance` for the `geographic-region`, expressed as:
        - [x] (pocket-friendly) `numerator and denominator`
        - [x] (pocket-friendly) `percentage`
        - [x] (pocket-friendly) `barchart bar-width of total-width`
        - [x] (pocket-friendly) `colour-gradation`
      - [x] (pocket-friendly) Click on a `combination-therapy` to see the `combination-therapy in geographic-region page`
      - [x] If you have a `pointer`, see the `tooltip` when you hover over the `numerator bar`, showing `predicted percentage of combination-therapy-resistance`
- [x] (pocket-friendly) Click on the `technical details about antimalarial-resistance prediction button` to see the `technical details about antimalarial-resistance prediction page`

### From an `antimalarial-drug in geographic-region page`
- [x] (pocket-friendly) See the `antimalarial-drug in geographic-region summary`
- [x] (pocket-friendly) See the `antimalarial-drug in geographic-region status`
- [x] (pocket-friendly) Click on the `antimalarial-drug button` to see the `antimalarial-drug page`
- [x] (pocket-friendly) Click on the `geographic-region button` to see the `geographic-region page`
- [x] (pocket-friendly) See the `antimalarial-drug geographic-map`
  - [x] (pocket-friendly) See the `geographic-site markers`
    - For each `geographic-site marker`:
      - [x] Click on the `geographic-site marker` to see a `geographic-map popup`, showing: (pocket-problems) [observatory-web issue #442](https://github.com/wtchg-kwiatkowski/observatory-web/issues/442)
        - [x] the `geographic-site name` (pocket-problems) ^
        - [x] the `predicted percentage of antimalarial-drug resistance` in the `geographic-site` (pocket-problems) ^
        - [x] a `geographic-site button` (pocket-problems) ^
          - [x] Click on the `geographic-site button` to see the `geographic-site page` (pocket-problems) ^
  - [x] (pocket-friendly) See the `geographic-region polygons`
- [x] See the `antimalarial-drug resistance by geographic-site barchart` (pocket-problems) [observatory-web issue #435](https://github.com/wtchg-kwiatkowski/observatory-web/issues/435)
  - [x] (pocket-friendly) See the `antimalarial-drug resistance by geographic-site barchart introduction`
  - [x] (pocket-friendly) See the `antimalarial-drug resistance by geographic-site barchart total counts explanation`
  - [x] (pocket-friendly) See a `barchart bar` for every `geographic-site`
    - For each `geographic-site`:
      - [x] (pocket-friendly) See which `country` the `geographic-site` belongs to
      - See the `predicted proportion of antimalarial-drug resistance` for the `geographic-site`, expressed as:
        - [x] (pocket-friendly) `numerator and denominator`
        - [x] (pocket-friendly) `percentage`
        - [x] (pocket-friendly) `barchart bar-width of total-width`
        - [x] (pocket-friendly) `colour-gradation`
      - [x] (pocket-friendly) Click on a `geographic-site` to see the `geographic-site page`
      - [x] If you have a `pointer`, see the `tooltip` when you hover over the `numerator bar`, showing `predicted percentage of antimalarial-drug resistance`
- [x] (pocket-friendly) Click on the `technical details about antimalarial-resistance prediction button` to see the `technical details about antimalarial-resistance prediction page`

### From a `combination-therapy in geographic-region page`
- [x] (pocket-friendly) See the `combination-therapy in geographic-region summary`
- [x] (pocket-friendly) See the `combination-therapy in geographic-region status`
- [x] (pocket-friendly) Click on the `combination-therapy button` to see the `combination-therapy page`
- [x] (pocket-friendly) Click on the `geographic-region button` to see the `geographic-region page`
- [x] (pocket-friendly) See the `combination-therapy geographic-map`
  - [x] (pocket-friendly) See the `geographic-site markers`
    - For each `geographic-site marker`
      - [x] Click on the `geographic-site marker` to see a `geographic-map popup`, showing: (pocket-problems) [observatory-web issue #442](https://github.com/wtchg-kwiatkowski/observatory-web/issues/442)
        - [x] the `geographic-site name`(pocket-problems) ^
        - [x] the `predicted percentage of combination-therapy-resistance` in the `geographic-site`(pocket-problems) ^
        - [x] a `geographic-site button`(pocket-problems) ^
          - [x] Click on the `geographic-site button` to see the `geographic-site page`(pocket-problems) ^
  - [x] (pocket-friendly) See the `geographic-region polygons`
- [x] See the `combination-therapy resistance by geographic-site barchart` (pocket-problems) [observatory-web issue #435](https://github.com/wtchg-kwiatkowski/observatory-web/issues/435)
  - [x] (pocket-friendly) See the `combination-therapy resistance by geographic-site barchart introduction`
  - [x] (pocket-friendly) See the `combination-therapy resistance by geographic-site barchart total counts explanation`
  - [x] (pocket-friendly) See a `barchart bar` for every `geographic-site`
  - For each `geographic-site`:
    - [x] (pocket-friendly) See which `country` the `geographic-site` belongs to
    - See the `predicted proportion of combination-therapy-resistance` for the `geographic-site`, expressed as:
      - [x] (pocket-friendly) `numerator and denominator`
      - [x] (pocket-friendly) `percentage`
      - [x] (pocket-friendly) `barchart bar-width of total-width`
      - [x] (pocket-friendly) `colour-gradation`
    - [x] (pocket-friendly) Click on a `geographic-site` to see the `geographic-site page`
    - [x] If you have a `pointer`, see the `tooltip` when you hover over the `numerator bar`, showing `predicted percentage of combination-therapy-resistance`
- [x] (pocket-friendly) Click on the `technical details about antimalarial-resistance prediction button` to see the `technical details about antimalarial-resistance prediction page`

### From the `geographic-site page`
- [x] (pocket-friendly) See the `geographic-site name`
- [x] (pocket-friendly) See the `geographic-site country name`
- [x] (pocket-friendly) See the `number and type of samples collected from the geographic-site`
- [x] (pocket-friendly) See the `sample-collection date-range for the geographic-site`
- [x] (pocket-friendly) See the `number of studies that contributed samples at the geographic-site`
- [x] (pocket-friendly) See the `all antimalarial-drugs geographic-map for the geographic-site`
  - [x] Drag on the `all antimalarial-drugs geographic-map` to pan left, right, up and down (pocket-problems) [observatory-web issue #449](https://github.com/wtchg-kwiatkowski/observatory-web/issues/449)
  - [ ] Click on the `geographic-map zoom buttons` to zoom in and out (pocket-problems) [observatory-web issue #441](https://github.com/wtchg-kwiatkowski/observatory-web/issues/441) [observatory-web issue #449](https://github.com/wtchg-kwiatkowski/observatory-web/issues/449)
  - [x] If you have a `pointer` and a `scroll-wheel`, scroll up and down while hovering over the `geographic-map` to zoom in and out
  - [x] (pocket-friendly) See the `all antimalarial-drugs geographic-site marker`
  - [x] (pocket-friendly) See the `all antimalarial-drugs geographic-site marker legend`
  - [x] See the `legend for the antimalarial-drug resistance-status colour-gradation` (pocket-problems) [observatory-web issue #432](https://github.com/wtchg-kwiatkowski/observatory-web/issues/432)
- [x] See the `antimalarial-drug resistance by geographic-site barchart` (pocket-problems) [observatory-web issue #435](https://github.com/wtchg-kwiatkowski/observatory-web/issues/435)
  - [x] (pocket-friendly) See the `antimalarial-drug resistance by geographic-site barchart introduction`
  - [x] (pocket-friendly) See the `antimalarial-drug resistance by geographic-site barchart total counts explanation`
  - [x] (pocket-friendly) See a `barchart bar` for every `antimalarial-drug`
    - For each `antimalarial-drug`:
      - See the `predicted proportion of antimalarial-drug resistance` for the `geographic-site`, expressed as:
        - [x] (pocket-friendly) `numerator and denominator`
        - [x] (pocket-friendly) `percentage`
        - [x] (pocket-friendly) `barchart bar-width of total-width`
        - [x] (pocket-friendly) `colour-gradation`
      - [x] (pocket-friendly) Click on a `antimalarial-drug` to see the `antimalarial-drug page`
      - [ ] If you have a `pointer`, see the `tooltip` when you hover over the `numerator bar`, showing `predicted percentage of antimalarial-drug resistance` [observatory-web issue #411](https://github.com/wtchg-kwiatkowski/observatory-web/issues/411)
- [x] See the `combination-therapy resistance by geographic-site barchart` (pocket-problems) [observatory-web issue #435](https://github.com/wtchg-kwiatkowski/observatory-web/issues/435)
  - [x] (pocket-friendly) See the `combination-therapy resistance by geographic-site barchart introduction`
  - [x] (pocket-friendly) See the `combination-therapy resistance by geographic-site barchart total counts explanation`
  - [x] (pocket-friendly) See a `barchart bar` for every `combination-therapy`
  - For each `combination-therapy`:
    - See the `predicted proportion of combination-therapy-resistance` for the `geographic-site`, expressed as:
      - [x] (pocket-friendly) `numerator and denominator`
      - [x] (pocket-friendly) `percentage`
      - [x] (pocket-friendly) `barchart bar-width of total-width`
      - [x] (pocket-friendly) `colour-gradation`
    - [x] (pocket-friendly) Click on a `combination-therapy` to see the `combination-therapy page`
    - [x] If you have a `pointer`, see the `tooltip` when you hover over the `numerator bar`, showing `predicted percentage of antimalarial-drug resistance`
- [ ] Click on the `site-samples table button` to see the `site-samples table page`
- For each `study-origin` at the `geographic-site`:
  - [x] (pocket-friendly) See the `number and type of samples collected from the study`
  - [x] (pocket-friendly) See the `sample-collection date-range for the study`
  - [x] (pocket-friendly) See the `sample-collector names for the study`
  - [x] (pocket-friendly) See the `study identifier`
- [x] (pocket-friendly) Click on the `technical details about antimalarial-resistance prediction button` to see the `technical details about antimalarial-resistance prediction page`

### From the `pf-resistance-map page`
- [x] (pocket-friendly) See the `all antimalarial-drugs geographic-map option`
- [x] See the `list of antimalarial-drugs as map options` (pocket-problems) [observatory-web issue #434](https://github.com/wtchg-kwiatkowski/observatory-web/issues/434)
  - [x] (pocket-friendly) Click on an `antimalarial-drug geographic-map option` to see the `antimalarial-drug geographic-map` for the selected `antimalarial-drug`
- [x] See the `list of combination-therapies as map options` (pocket-problems) [observatory-web issue #434](https://github.com/wtchg-kwiatkowski/observatory-web/issues/434)
  - [x] (pocket-friendly) Click on a `combination-therapy geographic-map option` to see the `combination-therapy geographic-map` for the selected `combination-therapy`
- If the `all antimalarial-drugs geographic-map option` is selected:
  - [x] (pocket-friendly) See the `all antimalarial-drugs geographic-map introduction`
  - [x] (pocket-friendly) See the `all antimalarial-drugs geographic-map`
    - [x] Drag on the `all antimalarial-drugs geographic-map` to pan left, right, up and down (pocket-problems) [observatory-web issue #449](https://github.com/wtchg-kwiatkowski/observatory-web/issues/449)
    - [ ] Click on the `geographic-map zoom buttons` to zoom in and out (pocket-problems) [observatory-web issue #441](https://github.com/wtchg-kwiatkowski/observatory-web/issues/441) [observatory-web issue #449](https://github.com/wtchg-kwiatkowski/observatory-web/issues/449)
    - [x] If you have a `pointer` and a `scroll-wheel`, scroll up and down while hovering over the `geographic-map` to zoom in and out
    - [ ] See the `geographic-region polygons` [observatory-web issue #450](https://github.com/wtchg-kwiatkowski/observatory-web/issues/450)
    - [ ] See the `all antimalarial-drugs geographic-site markers` [observatory-web issue #250](https://github.com/wtchg-kwiatkowski/observatory-web/issues/250)
      - For each `all antimalarial-drugs geographic-site marker`:
        - [x] See the `antimalarial-drug resistance-status colour-gradation` for every `antimalarial-drug` at the `geographic-site`
        - [x] (pocket-friendly) Click on the `geographic-site marker` to see a `geographic-map popup`, showing:
          - [x] (pocket-friendly) the `geographic-site name`
          - [x] (pocket-friendly) the `geographic-site country name`
          - [x] (pocket-friendly) the `number and type of samples collected from the geographic-site`
          - [x] (pocket-friendly) the `study-origin of samples collected from the geographic-site`
          - [x] (pocket-friendly) the `antimalarial-drug resistance-status colour-gradation` for every `antimalarial-drug` at the `geographic-site`
          - [x] (pocket-friendly) the `geographic-site button`
            - [x] (pocket-friendly) Click on the `geographic-site button` to see the `geographic-site page`
  - [x] (pocket-friendly) See the `all antimalarial-drugs geographic-site marker legend`
  - [x] See the `legend for the antimalarial-drug resistance-status colour-gradation` (pocket-problems) [observatory-web issue #432](https://github.com/wtchg-kwiatkowski/observatory-web/issues/432)
  - [x] (pocket-friendly) See the `key for the antimalarial-drugs markers`
    - [x] (pocket-friendly) Click on an `antimalarial-drug marker key icon` to see the `antimalarial-drug geographic-map page` for the `antimalarial-drug`
- If an `antimalarial-drug geographic-map option` is selected:
  - [x] (pocket-friendly) See the `antimalarial-drug geographic-map introduction`
  - [x] (pocket-friendly) See the `antimalarial-drugs geographic-map`
    - [x] Drag on the `all antimalarial-drugs geographic-map` to pan left, right, up and down (pocket-problems) [observatory-web issue #449](https://github.com/wtchg-kwiatkowski/observatory-web/issues/449)
    - [ ] Click on the `geographic-map zoom buttons` to zoom in and out (pocket-problems) [observatory-web issue #441](https://github.com/wtchg-kwiatkowski/observatory-web/issues/441) [observatory-web issue #449](https://github.com/wtchg-kwiatkowski/observatory-web/issues/449)
    - [x] If you have a `pointer` and a `scroll-wheel`, scroll up and down while hovering over the `geographic-map` to zoom in and out
    - [x] See the `geographic-region polygons`
    - [x] (pocket-friendly) See the `geographic-site markers`
      - For each `geographic-site marker`:
        - [x] (pocket-friendly) See the `antimalarial-drug resistance-status colour-gradation` for the selected `antimalarial-drug` at the `geographic-site`
        - [x] Click on the `geographic-site marker` to see a `geographic-map popup`, showing: (pocket-problems) [observatory-web issue #442](https://github.com/wtchg-kwiatkowski/observatory-web/issues/442)
          - [x] (pocket-friendly) the `geographic-site name`
          - [ ] the `geographic-site country name` [observatory-web issue #418](https://github.com/wtchg-kwiatkowski/observatory-web/issues/418)
          - [x] (pocket-friendly) the `geographic-site button`
            - [x] (pocket-friendly) Click on the `geographic-site button` to see the `geographic-site page`
  - [x] See the `legend for the antimalarial-drug resistance-status colour-gradation` (pocket-problems) [observatory-web issue #432](https://github.com/wtchg-kwiatkowski/observatory-web/issues/432)
- If a `combination-therapy geographic-map option` is selected:
  - [x] (pocket-friendly) See the `combination-therapy geographic-map introduction`
  - [x] (pocket-friendly) See the `combination-therapy geographic-map`
    - [x] See the `geographic-region polygons`
    - [x] (pocket-friendly) See the `geographic-site markers`
      - For each `geographic-site marker`:
        - [x] (pocket-friendly) See the `combination-therapy-resistance-status colour-gradation` for the selected `combination-therapy` at the `geographic-site`
        - [x] Click on the `geographic-site marker` to see a `geographic-map popup`, showing: (pocket-problems) [observatory-web issue #442](https://github.com/wtchg-kwiatkowski/observatory-web/issues/442)
          - [x] (pocket-friendly) the `geographic-site name`
          - [ ] the `geographic-site country name` [observatory-web issue #418](https://github.com/wtchg-kwiatkowski/observatory-web/issues/418)
          - [x] (pocket-friendly) the `geographic-site button`
            - [x] (pocket-friendly) Click on the `geographic-site button` to see the `geographic-site page`
  - [x] See the `legend for the combination-therapy-resistance-status colour-gradation` (pocket-problems) [observatory-web issue #432](https://github.com/wtchg-kwiatkowski/observatory-web/issues/432)

### From any `table page`
- [x] (pocket-friendly) See the `table entity-type icon`
- [ ] See the `table introduction` [observatory-web issue #267](https://github.com/wtchg-kwiatkowski/observatory-web/issues/267)
- [x] If no `table-filter` is in effect, click on the `add table-filter button` or the `top-bar table-filter button` to add a `table-filter` to the `table` using the `construct-and-apply-table-filter modal-dialog` (pocket-problems) [observatory-web issue #429](https://github.com/wtchg-kwiatkowski/observatory-web/issues/429)
- [x] If a `table-filter` is in effect, click on the `change table-filter button` or the `top-bar table-filter button` to change the `table-filter` using the `construct-and-apply-table-filter modal-dialog` (pocket-problems) [observatory-web issue #429](https://github.com/wtchg-kwiatkowski/observatory-web/issues/429)
- [x] Click on the `select columns button` to toggle the `columns` for the `table` using the `column-selector modal-dialog` (pocket-problems) [observatory-web issue #430](https://github.com/wtchg-kwiatkowski/observatory-web/issues/430)
- [x] (pocket-friendly) Specify the `search-text` for the `table text-search` to see only the rows that contain the `search-text` in `text-searchable columns`
- [x] (pocket-friendly) If a `table text-search` is in effect, see the current `search-text`
- [ ] Click on the `table-data-download button` to receive the current `table-data as a tab-delimited file` [observatory-web issue #399](https://github.com/wtchg-kwiatkowski/observatory-web/issues/399)  (pocket-problems) [observatory-web issue #438](https://github.com/wtchg-kwiatkowski/observatory-web/issues/438)
- [x] Click on the `table-pivot button` to see the `table-pivot page` for the `table` (pocket-problems) [observatory-web issue #439](https://github.com/wtchg-kwiatkowski/observatory-web/issues/439)
- [x] Click on the `table-plot button` to see the `table-plot page` for the `table` (pocket-problems) [observatory-web issue #439](https://github.com/wtchg-kwiatkowski/observatory-web/issues/439)
- [ ] Click on the `collapse side-menu button` to collapse the `side-menu` [observatory-web issue #268](https://github.com/wtchg-kwiatkowski/observatory-web/issues/268)
- [x] (pocket-friendly) If a `table-filter` is in effect, see the current `table-filter`
- [x] (pocket-friendly) If a `table-data column-sort` is in effect, see the current `table-data column-sort`
- [x] (pocket-friendly) See the `cardinal number of columns currently being shown`
- [x] (pocket-friendly) See the `cardinal number of columns available to be shown`
- [x] (pocket-friendly) See the `ordinal number of the first row currently being shown`
- [x] (pocket-friendly) See the `ordinal number of the last row currently being shown`
- [x] (pocket-friendly) See the `cardinal number of rows available to be shown`
- [x] (pocket-friendly) If the `cardinal number of rows available to be shown` is more than _table-data page-rows-size_ rows (i.e. there is more than one `page of table-data` available), and the `ordinal number of the last row currently being shown` is less than the `cardinal number of rows available to be shown` (i.e. the last `page of table-data` is not being shown), click on the `next page of table-data button` to see the `next page of table-data`
- [x] (pocket-friendly) If the `cardinal number of rows available to be shown` is more than _table-data page-rows-size_ rows (i.e. there is more than one `page of table-data` available), and the `ordinal number of the last row currently being shown` is less than the `cardinal number of rows available to be shown` (i.e. the last `page of table-data` is not being shown), click on the `last page of table-data button` to see the `last page of table-data`
- [x] (pocket-friendly) If the `cardinal number of rows available to be shown` is more than _table-data page-rows-size_ rows (i.e. there is more than one `page of table-data` available), and the `ordinal number of the first row currently being shown` is more than the _table-data page-rows-size_ rows (i.e. the first `page of table-data` is not being shown), click on the `previous page of table-data button` to see the `previous page of table-data`
- [x] (pocket-friendly) If the `cardinal number of rows available to be shown` is more than _table-data page-rows-size_ rows (i.e. there is more than one `page of table-data` available), and the `ordinal number of the first row currently being shown` is more than the _table-data page-rows-size_ rows (i.e. the first `page of table-data` is not being shown), click on the `first page of table-data button` to see the `first page of table-data`
- [x] (pocket-friendly) See the `column labels` in the `column headings` for all of the `selected columns`
  - [x] If the `column` has a `column description`, click on the `column information icon-button` in the `column heading` to see the `column description`
- [x] See the `table-data values` for all of the `selected columns` and all of the `rows currently being shown` (pocket-problems) [observatory-web issue #451](https://github.com/wtchg-kwiatkowski/observatory-web/issues/451)
- [x] (pocket-friendly) Click on a `column heading` to toggle the `column sort-order` for that `column` and to change the current `table-data column-sort`
- [x] (pocket-friendly) If the `column` contains `key internal table-data values`, click on any `key internal table-data value` to see more information relating to that `key internal table-data value`
- [x] If the `column` contains `key external-reference-values`, click on any `key external-reference-value` to see more information relating to that `key external-reference-value` in a `new web-browser tab`
- [x] (pocket-friendly) If the `column` contains `categorical values`, see appropriate `table-cell background-colour-gradation` for those `table-data cells`

### From the `construct-and-apply-table-filter modal-dialog`
- [x] (pocket-friendly) See the `modal-dialog title`
- [x] (pocket-friendly) See the `modal-dialog entity-icon`
- [x] See the `modal-dialog description` (pocket-problems) [observatory-web issue #429](https://github.com/wtchg-kwiatkowski/observatory-web/issues/429)
- [ ] See the `list of predefined table-filters` [observatory-web issue #170](https://github.com/wtchg-kwiatkowski/observatory-web/issues/170)
  - [x] (pocket-friendly) Click on a `predefined table-filter` to see the `table-filter diagram` and the `table-filter string-representation` for that `table-filter`
- [x] (pocket-friendly) See the `list of recently applied table-filters`
  - [x] Click on a `recently applied table-filter` to see the `table-filter diagram` and the `table-filter string-representation` for that `table-filter` (pocket-problems) [observatory-web issue #429](https://github.com/wtchg-kwiatkowski/observatory-web/issues/429)
- [x] See the `table-filter diagram` of the `table-filter in construction` (pocket-problems) [observatory-web issue #429](https://github.com/wtchg-kwiatkowski/observatory-web/issues/429)
- [x] If there are no `table-filter-criterion` in the `table-filter diagram`, click on the `add table-filter-criterion button` to add a `table-filter-criterion` using the `table-filter-criterion editor` (pocket-problems) [observatory-web issue #429](https://github.com/wtchg-kwiatkowski/observatory-web/issues/429)
- [x] If there are `table-filter-criterion` in the `table-filter diagram`, change any `table-filter-criterion` using the `table-filter-criterion editor` for any of the `table-filter criteria` (pocket-problems) [observatory-web issue #429](https://github.com/wtchg-kwiatkowski/observatory-web/issues/429)
- [ ] Click on the `apply table-filter button` to set the `table-filter in construction` (represented by the `table-filter diagram` and the `table-filter string-representation`) as the `table-filter`
[observatory-web issue #283](https://github.com/wtchg-kwiatkowski/observatory-web/issues/283)
- [x] If there is a `table-filter in construction` (represented by `table-filter-criteria` in the `table-filter diagram`) see the `table-filter string representation` of the `table-filter in construction` (pocket-problems) [observatory-web issue #429](https://github.com/wtchg-kwiatkowski/observatory-web/issues/429)
- [x] If there is no `table-filter in construction` (represented by no `table-filter-criteria` in the `table-filter diagram`) see the `no-table-filter message` (pocket-problems) [observatory-web issue #429](https://github.com/wtchg-kwiatkowski/observatory-web/issues/429)
- [ ] Click on the `cancel-and-close modal-dialog button` to cancel and close the `construct-and-apply-table-filter modal-dialog` [observatory-web issue #148](https://github.com/wtchg-kwiatkowski/observatory-web/issues/148)

### In the `table-filter-criterion editor`
- [x] Select a `column` from the `column selector` to use in the `table-filter-criterion` (pocket-problems) [observatory-web issue #429](https://github.com/wtchg-kwiatkowski/observatory-web/issues/429)
  - [ ] Select a `comparison operator` from the `comparison operator selector` to use in the `table-filter-criterion` [observatory-web issue #309](https://github.com/wtchg-kwiatkowski/observatory-web/issues/309)
    - If a `column with categorized-values` has been selected:
      - [ ] If the `value-is-equal-to-categorized-value operator` is selected, select the `categorized-value` [observatory-web issue #196](https://github.com/wtchg-kwiatkowski/observatory-web/issues/196)
      - [ ] If the `value-is-not-equal-to-categorized-value operator` is selected, select the `categorized-value` [observatory-web issue #196](https://github.com/wtchg-kwiatkowski/observatory-web/issues/196)
    - If a `column without categorized-values` has been selected:
      - [ ] If the `value-is-equal-to-comparison-text operator` is selected, enter the `comparison-text` [observatory-web issue #196](https://github.com/wtchg-kwiatkowski/observatory-web/issues/196)
      - [ ] If the `value-is-not-equal-to-comparison-text operator` is selected, enter the `comparison-text` [observatory-web issue #196](https://github.com/wtchg-kwiatkowski/observatory-web/issues/196)
    - If a `string-type column` has been selected:
      - [x] If the `value-contains-text operator` is selected, enter the `comparison-text` (pocket-problems) ^
      - [x] If the `value-does-not-contain-text operator` is selected, enter the `comparison-text` (pocket-problems) ^
      - [x] If the `value-starts-with-text operator` is selected, enter the `comparison-text` (pocket-problems) ^
      - [ ] If the `value-ends-with-text operator` is selected, enter the `comparison-text`
      - [x] If the `value-is-empty operator` is selected, the `table-filter-criterion` (pocket-problems) ^
      - [x] If the `value-is-not-empty operator` is selected, the `table-filter-criterion` (pocket-problems) ^
      - [x] If the `value-is-equal-to-another-column-value` is selected, select the `other column` from the `other column selector` (pocket-problems) ^
      - [x] If the `value-is-not-equal-to-another-column-value` is selected, select the `other column` from the `other column selector` (pocket-problems) ^
    - If a `number-type column` has been selected:
      - [x] If the `value-is-less-than-text operator` is selected, enter the `comparison-text` (pocket-problems) ^
      - [x] If the `value-is-greater-than-text operator` is selected, enter the `comparison-text` (pocket-problems) ^
      - [x] If the `value-is-less-than-or-equal-to-comparison-text operator` is selected, enter the `comparison-text` (pocket-problems) ^
      - [x] If the `value-is-greater-than-or-equal-to-comparison-text operator` is selected, enter the `comparison-text` (pocket-problems) ^
      - [x] If the `value-is-between-text-and-other-text` is selected, enter the `comparison-text` and `other comparison-text` (pocket-problems) ^
      - [x] If the `value-is-empty operator` is selected, the `table-filter-criterion` (pocket-problems) ^
      - [x] If the `value-is-not-empty operator` is selected, the `table-filter-criterion` (pocket-problems) ^
      - [x] If the `value-is-equal-to-another-column-value` is selected, select the `other column` from the `other column selector` (pocket-problems) ^
      - [x] If the `value-is-not-equal-to-another-column-value` is selected, select the `other column` from the `other column selector` (pocket-problems) ^
      - [x] If the `value-is-less-than-another-column-value operator` is selected, select the `other column` from the `other column selector` and specify the `other column linear coefficient` and the `other column constant coefficient` (pocket-problems) ^
      - [x] If the `value-is-greater-than-another-column operator` is selected, select the `other column` from the `other column selector` and specify the `other column linear coefficient` and the `other column constant coefficient`  (pocket-problems) ^
- [x] Click on the `add or-criterion-relationship button` to add an `or-criterion-relationship` to the `table-filter in construction` (pocket-problems) ^
- [x] Click on the `add and-criterion-relationship button` to add an `and-criterion-relationship` to the `table-filter in construction` (pocket-problems) ^
- [ ] Click on the `delete table-filter-criterion button` to delete the `table-filter-criterion` [observatory-web issue #311](https://github.com/wtchg-kwiatkowski/observatory-web/issues/311)

### From the `column-selector modal-dialog`
- [x] (pocket-friendly) See the `modal-dialog title`
- [x] See a `column-selector search textbox` (pocket-problems) [observatory-web issue #430](https://github.com/wtchg-kwiatkowski/observatory-web/issues/430)
  - [x] Type into `column-selector search textbox` to restrict the list of `table columns` to those that match
    - [x] See the matching text highlighted in the list of `table columns` (pocket-problems) ^
- [x] See the `list of columns available` (pocket-problems) [observatory-web issue #430](https://github.com/wtchg-kwiatkowski/observatory-web/issues/430)
  - For each `available column`:
    - [x] See the `column label` (pocket-problems) ^
    - [x] See the `column data-type icon` (pocket-problems) ^
    - [x] For any `column label` that is not self-explanatory, see the `column description` (pocket-problems) ^
    - [x] Click on the `column label`, `column description` or `column data-type icon` to add that `column` to the `list of selected columns` (pocket-problems) ^
    - [ ] See whether the `column` is included or excluded from the `table` [observatory-web issue #262](https://github.com/wtchg-kwiatkowski/observatory-web/issues/262)
- [x] See the `list of selected columns` (pocket-problems) [observatory-web issue #430](https://github.com/wtchg-kwiatkowski/observatory-web/issues/430)
  - For each `selected column`
    - [x] See the `column label` (pocket-problems) ^
    - [x] See the `column data-type icon` (pocket-problems) ^
    - [x] For any `column label` that is not self-explanatory, see the `column description` (pocket-problems) ^
    - [x] Click on the `column label`, `column description` or `column data-type icon` to remove that `column` from the `list of selected columns` (pocket-problems) ^
- [ ] Click on the `include all columns button` to include the `list of columns available` in the `table` [observatory-web issue #224](https://github.com/wtchg-kwiatkowski/observatory-web/issues/224)
- [ ] Click on the `exclude all columns button` to include the `list of columns available` in the `table` [observatory-web issue #224](https://github.com/wtchg-kwiatkowski/observatory-web/issues/224)
- [x] (pocket-friendly) Click on the `apply column selection button` to apply the `list of selected columns` to the `table page`
- [ ] Click on the `cancel-and-close modal-dialog button` to cancel and close the `column-selector modal-dialog` [observatory-web issue #148](https://github.com/wtchg-kwiatkowski/observatory-web/issues/148)

### From the `table-pivot page`
- [x] (pocket-friendly) See the `table-pivot icon`
- [x] (pocket-friendly) See the `table-pivot introduction`
- [x] If no `table-filter` is in effect, click on the `add table-filter button` to add a `table-filter` to the `table` using the `construct-and-apply-table-filter modal-dialog` (pocket-problems) [observatory-web issue #429](https://github.com/wtchg-kwiatkowski/observatory-web/issues/429)
- [x] If a `table-filter` is in effect, click on the `change table-filter button` to change the `table-filter` using the `construct-and-apply-table-filter modal-dialog` (pocket-problems) [observatory-web issue #429](https://github.com/wtchg-kwiatkowski/observatory-web/issues/429)
- [ ] Select a `column` from the `column selector` to specify the `table-pivot column-column` for the `table-pivot` [observatory-web issue #228](https://github.com/wtchg-kwiatkowski/observatory-web/issues/228) [observatory-web issue #319](https://github.com/wtchg-kwiatkowski/observatory-web/issues/319)
- [ ] Select an `other column` from the `other column selector` to specify the `table-pivot row-column` for the `table-pivot` [observatory-web issue #228](https://github.com/wtchg-kwiatkowski/observatory-web/issues/228)
- [x] (pocket-friendly) Select a `table-pivot aggregate-type` from the `table-pivot aggregate-type selector` to specify the `table-pivot aggregate-type` for the `table-pivot`
- [x] (pocket-friendly) If a `table-pivot column-column` and `table-pivot row-column` and `table-pivot aggregate-type` have been selected/specified, see the `table-pivot table-data`
  - [x] (pocket-friendly) See the `table-pivot column-column values as labels` in the `column headings` for the selected/specified `table-pivot column-column`
  - [x] (pocket-friendly) See the `table-pivot row-column values as labels` in the `row headings` for the selected/specified `table-pivot row-column`
  - [ ] Click on a `column heading` to toggle the `column sort-order` for that `column` and to change the current `table-data column-sort` [observatory-web issue #452](https://github.com/wtchg-kwiatkowski/observatory-web/issues/452)
  - [ ] Click on a `row heading` to toggle the `row sort-order` for that `row` and to change the current `table-data row-sort` [observatory-web issue #318](https://github.com/wtchg-kwiatkowski/observatory-web/issues/318) [observatory-web issue #452](https://github.com/wtchg-kwiatkowski/observatory-web/issues/452)
  - [x] (pocket-friendly) If the `table-pivot column-column` contains `key internal table-data values`, click on any `key internal table-data value` to see more information relating to that `key internal table-data value`
  - [x] (pocket-friendly) If the `table-pivot row-column` contains `key internal table-data values`, click on any `key internal table-data value` to see more information relating to that `key internal table-data value`
  - [x] (pocket-friendly) If the `table-pivot column-column` contains `key external-reference-values`, click on any `key external-reference-value` to see more information relating to that `key external-reference-value` in a `new web-browser tab`
  - [x] (pocket-friendly) If the `table-pivot row-column` contains `key external-reference-values`, click on any `key external-reference-value` to see more information relating to that `key external-reference-value` in a `new web-browser tab`
  - [x] (pocket-friendly) If the `table-pivot column-column` contains `categorical values`, see appropriate `table-cell background-colour-gradation` for those `table-pivot column-column values as labels`
  - [x] (pocket-friendly) If the `table-pivot row-column` contains `categorical values`, see appropriate `table-cell background-colour-gradation` for those `table-pivot row-column values as labels`
  - [x] (pocket-friendly) See the `table-pivot table-data values` for the selected/specified `table-pivot column-column` and `table-pivot row-column` and `table-pivot aggregate-type`
    - [x] (pocket-friendly) If the `table-pivot aggregate-type counts` is selected, see the `table-pivot count` for each of the `table-data cells`
    - [x] (pocket-friendly) If the `table-pivot aggregate-type percentage-of-total` is selected, see the `table-pivot percentage-of-total` for each of the `table-data cells` with appropriate `table-cell background-colour-gradation`
    - [x] (pocket-friendly) If the `table-pivot aggregate-type percentage-of-column-total` is selected, see the `table-pivot percentage-of-column-total` for each of the `table-data cells` with appropriate `table-cell background-colour-gradation`
    - [x] (pocket-friendly) If the `table-pivot aggregate-type percentage-of-row-total` is selected, see the `table-pivot percentage-of-row-total` for each of the `table-data cells` with appropriate `table-cell background-colour-gradation`
  - [ ] See the `table-pivot aggregate-type heading for all column-columns` [observatory-web issue #230](https://github.com/wtchg-kwiatkowski/observatory-web/issues/230)
  - [x] (pocket-friendly) See the `table-pivot aggregate-type values for all column-columns`
  - [ ] See the `table-pivot aggregate-type heading for all row-columns` [observatory-web issue #230](https://github.com/wtchg-kwiatkowski/observatory-web/issues/230)
  - [x] (pocket-friendly) See the `table-pivot aggregate-type values for all row-columns`
  - [ ] See the `column name` of the selected `table-pivot column-column` in the `heading for the table-pivot column-columns` [observatory-web issue #231](https://github.com/wtchg-kwiatkowski/observatory-web/issues/231)
  - [x] (pocket-friendly) See the `column name` of the selected `table-pivot row-column` in the `heading for the table-pivot row-columns`
  - [ ] If the selected `table-pivot column-column` has a `column description`, click on the `column information icon-button` in the `heading for the table-pivot column-columns` to see the `column description` [observatory-web issue #233](https://github.com/wtchg-kwiatkowski/observatory-web/issues/233)
  - [ ] If the selected `table-pivot row-column` has a `column description`, click on the `column information icon-button` in the `heading for the table-pivot row-columns` to see the `column description` [observatory-web issue #233](https://github.com/wtchg-kwiatkowski/observatory-web/issues/233)
  - [ ] Click on any `table-data cell` to see a `table page` with a `table-filter` corresponding to the `aggregate value` [observatory-web issue #232](https://github.com/wtchg-kwiatkowski/observatory-web/issues/232)
- [ ] Click on the `collapse side-menu button` to collapse the `side-menu` [observatory-web issue #268](https://github.com/wtchg-kwiatkowski/observatory-web/issues/268)
- [x] (pocket-friendly) If a `table-filter` is in effect, see the current `table-filter`
- [x] (pocket-friendly) If a `table-data column-sort` is in effect, see the current `table-data column-sort`
- [x] (pocket-friendly) If a `table-data row-sort` is in effect, see the current `table-data row-sort`

### From the `table-plot page`
- [x] (pocket-friendly) See the `table-plot icon`
- [x] (pocket-friendly) See the `table-plot introduction`
- [x] (pocket-friendly) Select a `table` from the `table selector` to use as the `table-plot table` in the `table-plot`
- [x] If no `table-filter` is in effect, click on the `add table-filter button` to add a `table-filter` to the `table` using the `construct-and-apply-table-filter modal-dialog` (pocket-problems) [observatory-web issue #429](https://github.com/wtchg-kwiatkowski/observatory-web/issues/429)
- [x] If a `table-filter` is in effect, click on the `change table-filter button` to change the `table-filter` using the `construct-and-apply-table-filter modal-dialog` (pocket-problems) [observatory-web issue #429](https://github.com/wtchg-kwiatkowski/observatory-web/issues/429)
- [ ] If a `table-filter` is in effect, see the current `table-filter` [observatory-web issue #330](https://github.com/wtchg-kwiatkowski/observatory-web/issues/330)
- [x] (pocket-friendly) Select a `random sample-subset size` from the `random sample-subset size selector` to use in the `table-plot`
- [x] (pocket-friendly) Select a `table-plot plot-type` from the `table-plot plot-type selector` to use in the `table-plot`
- [x] (pocket-friendly) If the `table-plot plot-type bar` is selected, see the `table-plot horizontal-axis-column selector` and the `table-plot vertical-axis-column selector`
- [x] (pocket-friendly) If the `table-plot plot-type histogram` is selected, see the `table-plot horizontal-axis-column selector`
- [x] (pocket-friendly) If the `table-plot plot-type two-dimensional-histogram` is selected, see the `table-plot horizontal-axis-column selector` and the `table-plot vertical-axis-column selector`
- [x] (pocket-friendly) If the `table-plot plot-type box-and-whisker` is selected, see the `table-plot horizontal-axis-column selector` and the `table-plot vertical-axis-column selector`
- [x] (pocket-friendly) If the `table-plot plot-type scatter` is selected, see the `table-plot horizontal-axis-column selector`, the `table-plot vertical-axis-column selector` and the `table-plot colour-column selector`
- [x] (pocket-friendly) If a `table-plot table` and `table-plot plot-type` and the required `table-plot column selectors` have been selected, see the `table-plot plot-data`
  - [ ] See the `labelled axes` [observatory-web issue #239](https://github.com/wtchg-kwiatkowski/observatory-web/issues/239)
  - [x] See the `plotly toolbar` (pocket-problems) [observatory-web issue #455](https://github.com/wtchg-kwiatkowski/observatory-web/issues/455)
    - [x] Click on the `table-plot download-as-a-png-file button` to download the `table-plot as a png file` (pocket-problems) [observatory-web issue #454](https://github.com/wtchg-kwiatkowski/observatory-web/issues/454)
    - [x] (pocket-friendly) Click on the `table-plot open-and-edit-in-plotly button` to open the `table-plot` in the `plotly website`
    - [x] (pocket-friendly) Click on the `table-plot zoom-enable button` to enable the `table-plot zoom features` (they are enabled by default) and disable the `table-plot pan features`
    - If the `table-plot zoom features` are enabled (they are enabled by default) and you have a `pointer`:
      - [x] Click and drag on the `table-plot` to `zoom in`, by specifying a rectangular area
      - [x] Double-click on the `table-plot` to `zoom out`
      - [x] Click on the `table-plot pan-enable button` to enable the `table-plot pan features` (they are disabled by default) and disable the `table-plot zoom features`
      - If the `table-plot pan features` are enabled (they are disabled by default) and you have a `pointer`:
        - [x] Click and drag on the `table-plot` to `pan`
    - [x] (pocket-friendly) Click on the `table-plot zoom-in button` to `zoom in`
    - [x] (pocket-friendly) Click on the `table-plot zoom-out button` to `zoom out`
    - [x] (pocket-friendly) Click on the `table-plot auto-scale button` to `auto-scale`
    - [ ] Click on the `table-plot reset-axes button` to `reset axes` [observatory-web issue #331](https://github.com/wtchg-kwiatkowski/observatory-web/issues/331)
    - [x] Click on the `table-plot show-closest-data-on-hover button` to enable the `table-plot show-closest-data-on-hover feature` (it is disabled by default) and disable the `table-plot compare-data-on-hover feature`
    - [x] Click on the `table-plot compare-data-on-hover button` to enable the `table-plot compare-data-on-hover feature` (it is disabled by default) and disable the `table-plot show-closest-data-on-hover feature`
    - If the `show-closest-data-on-hover feature` is enabled (it is disabled by default) and you have a `pointer`:
      - [x] Hover over a `plotted bar` to see the `table-plot horizontal-axis-column value` and the `table-plot vertical-axis-column value`
      - [x] Click on the `table-plot toggle-spike-lines button` to `toggle spike lines`
  - If the `table-plot plot-type bar` is selected:
    - [x] (pocket-friendly) See the `plotted bars`
  - If the `table-plot plot-type histogram` is selected:`
    - [x] (pocket-friendly) See the `plotted bars`
  - If the `table-plot plot-type two-dimensional-histogram` is selected:
    - [x] (pocket-friendly) See the `plotted areas`
    - [x] (pocket-friendly) See the `two-dimensional-histogram legend`
  - If the `table-plot plot-type box-and-whisker` is selected:
    - [x] (pocket-friendly) See the `plotted boxes-with-whiskers`
  - If the `table-plot plot-type scatter` is selected and no `table-plot colour-column` has been selected:
    - [x] (pocket-friendly) See the `plotted points`
  - If the `table-plot plot-type scatter` is selected and a `table-plot colour-column` has been selected:
    - [x] (pocket-friendly) See the `plotted colour-coded-points`
    - [x] (pocket-friendly) See the `colour-coded-point legend`

### From the `samples-table page`
- [ ] All the features of a generic `table page`

### From the `variants-table page`
- [ ] All the features of a generic `table page`

### From a `site-samples table page`
- [ ] All the features of a generic `table page`

### From the `pf-antimalarial-drug resistance genes page`
- [x] See the `genes that MalariaGEN Analytics says are involved in antimalarial-drug resistance`
  - For each `antimalarial-drug resistance gene`:
    - [x] See the `antimalarial-drug resistance gene short-name`
    - [x] See the `antimalarial-drug resistance gene short-description
    - [x] Click on the `antimalarial-drug resistance gene button` to see the `antimalarial-drug resistance gene page`

### From an `antimalarial-drug resistance gene page`
- [x] (pocket-friendly) See the `antimalarial-drug resistance gene short-name`
- [x] (pocket-friendly) See the `antimalarial-drug resistance gene long-name`
- [x] (pocket-friendly) See the `antimalarial-drug resistance gene long-description`
- [x] (pocket-friendly) If there are any, see the `antimalarial-drug resistance gene alias-names`
- [x] (pocket-friendly) See the `antimalarial-drug resistance gene codon-positions`
- [x] (pocket-friendly) Click on the `antimalarial-drug button` to see the `antimalarial-drug page`
- [x] See the `colour-gradated bar-chart of antimalarial-drug resistance as proportion-of-samples for the the full list of geographic-regions for the antimalarial-drug` (pocket-problems) [observatory-web issue #435](https://github.com/wtchg-kwiatkowski/observatory-web/issues/435)
- [x] (pocket-friendly) See the `antimalarial-drug resistance gene variation description`
- [x] (pocket-friendly) Click on the `antimalarial-drug resistance genetic variants-table button` to see the `antimalarial-drug resistance genetic variants-table page`

### From the `antimalarial-drug resistance genetic variants-table page`
- [x] See the `table of antimalarial-drug resistance genetic variants` (pocket-problems) [observatory-web issue #436](https://github.com/wtchg-kwiatkowski/observatory-web/issues/436)
  - For each `antimalarial-drug resistance genetic variant`:
    - [x] (pocket-friendly) See the `antimalarial-drug resistance genetic variant amino-acid change`
    - [x] (pocket-friendly) See the `antimalarial-drug resistance genetic variant position`
    - [x] (pocket-friendly) See the `colour-gradated antimalarial-drug resistance genetic variant non-reference allele frequency for each geographic-region`
  - [x] (pocket-friendly) Click on the `column label` to toggle the `column sort order` between `ascending order`, `descending order` or `default order`
    - [x] (pocket-friendly) See the current `column sort order` of each `column`
  - [x] (pocket-friendly) For any `column label` that is not self-explanatory, click on the `column information icon-button` to see the `column description`
  - For each row:
    - [x] (pocket-friendly) Click on the `row` to see the `genetic variant page`

### From the `genetic variant page`
- [x] (pocket-friendly) See the `genetic variant amino-acid change`
- [x] (pocket-friendly) See the `genetic variant chromosome`
- [x] (pocket-friendly) See the `genetic variant chromosomal position`
- [x] (pocket-friendly) See the `genetic variant gene`
  - [ ] Click on the `genetic variant gene link` to see the `antimalarial-drug resistance gene page` [observatory-web issue #425](https://github.com/wtchg-kwiatkowski/observatory-web/issues/425)
- [x] See the `genetic variant allele-frequencies map` (pocket-problems) [observatory-web issue #449](https://github.com/wtchg-kwiatkowski/observatory-web/issues/449)
- [ ] See the `legend for the genetic variant allele-frequency colours` [observatory-web issue #424](https://github.com/wtchg-kwiatkowski/observatory-web/issues/424)

### From the `genome-browser page`
- [x] (pocket-friendly) See the `genome-browser icon`
- [x] (pocket-friendly) See the `genome-browser introduction`
- [x] Click on the `add genome-browser channels button` to see the `genome-browser channel-adder modal-dialog` (pocket-problems) [observatory-web issue #440](https://github.com/wtchg-kwiatkowski/observatory-web/issues/440)
- [x] (pocket-friendly) See a button to view the `variants-table page`
- [ ] Click on the `collapse side-menu button` to collapse the `side-menu` [observatory-web issue #268](https://github.com/wtchg-kwiatkowski/observatory-web/issues/268)
- [x] (pocket-friendly) See the `genome-browser chromosome being displayed`
- [x] (pocket-friendly) Select a `genome-browser chromosome` using the `genome-browser chromosome selector` to change the `genome-browser chromosome being displayed`
- [x] (pocket-friendly) See the `genome-browser chromosome being displayed`
- [x] (pocket-friendly) See and edit the `genome-browser chromosome-region being displayed`
- [x] (pocket-friendly) See and edit the `genome-browser base-position-midpoint of the chromosome-region being displayed`
- [x] (pocket-friendly) See and edit the `genome-browser width-in-base-positions of the chromosome-region being displayed`
- [x] (pocket-friendly) See the `genome-browser base-position-ticks of the chromosome-region being displayed`
- [x] (pocket-friendly) See the `genome-browser reference-sequence channel`
  - [x] (pocket-friendly) If you are zoomed out, see the `genome-browser reference-sequence summarized-base-colours`
  - [x] If you are zoomed in, see the `genome-browser reference-sequence base-letters` and their corresponding `genome-browser reference-sequence base-colours` (pocket-problems) [observatory-web issue #456](https://github.com/wtchg-kwiatkowski/observatory-web/issues/456)
  - [ ] Click on the `genome-browser-channel information-area icon-button` to toggle the appearance of the `genome-browser-channel information-area` for the `genome-browser reference-sequence channel` [observatory-web issue #139](https://github.com/wtchg-kwiatkowski/observatory-web/issues/139)
    - If the `genome-browser-channel information-area` is showing for the `genome-browser reference-sequence channel`:
      - [x] (pocket-friendly) See the `genome-browser reference-sequence base-colours legend`
      - [ ] Click on the `genome-browser reference-sequence display-sequence button` to display the `genome-browser reference-sequence being displayed` as a `string of text` inside a `tooltip` [observatory-web issue #192](https://github.com/wtchg-kwiatkowski/observatory-web/issues/192) [observatory-web issue #156](https://github.com/wtchg-kwiatkowski/observatory-web/issues/156)
- [x] (pocket-friendly) See the `genome-browser genes channel`
  - If there is a `gene` within the `chromosome-region being displayed`:
    - [ ] See the `genome-browser genes-channel gene` [observatory-web issue #158](https://github.com/wtchg-kwiatkowski/observatory-web/issues/158) [observatory-web issue #159](https://github.com/wtchg-kwiatkowski/observatory-web/issues/159)
      - [x] (pocket-friendly) See the `genome-browser genes-channel gene coding-sequence regions`
  - [ ] Click on the `genome-browser-channel information icon-button` to toggle the appearance of the `genome-browser-channel information` for the `genome-browser genes channel` [observatory-web issue #139](https://github.com/wtchg-kwiatkowski/observatory-web/issues/139) (pocket-problems) [observatory-web issue #457](https://github.com/wtchg-kwiatkowski/observatory-web/issues/457) [observatory-web issue #458](https://github.com/wtchg-kwiatkowski/observatory-web/issues/458)
    - If the `genome-browser-channel information` is showing:
      - [x] See the `genome-browser genes-channel gene legend` (pocket-problems) ^
- If it is the first time that you have loaded the `genome-browser page` or you haven't modified the `genome-browser` (if the `genome-browser` has the `default genome-browser state`):
  - [x] See the `genome-browser variants channel` (pocket-problems) [observatory-web issue #458](https://github.com/wtchg-kwiatkowski/observatory-web/issues/458)
    - [ ] Click on the `close genome-browser-channel button` to close the `genome-browser variants channel` [observatory-web issue #134](https://github.com/wtchg-kwiatkowski/observatory-web/issues/134) (pocket-problems) [observatory-web issue #457](https://github.com/wtchg-kwiatkowski/observatory-web/issues/457)
    - [x] Click on the `genome-browser-channel settings-area icon-button` to toggle the appearance of the `genome-browser-channel settings-area` for the `genome-browser variants channel` (pocket-problems) [observatory-web issue #457](https://github.com/wtchg-kwiatkowski/observatory-web/issues/457)
      - If the `genome-browser-channel settings-area` is showing for the `genome-browser variants channel`:
        - [x] If no `table-filter` is in effect, click on the `add table-filter button` to add a `table-filter` to the `table` using the `construct-and-apply-table-filter modal-dialog` (pocket-problems) [observatory-web issue #429](https://github.com/wtchg-kwiatkowski/observatory-web/issues/429)
        - If a `table-filter` is in effect:
          - [x] See the current `table-filter` (pocket-problems) ^
          - [x] Click on the `change table-filter button` to change the `table-filter` using the `construct-and-apply-table-filter modal-dialog` (pocket-problems) [observatory-web issue #429](https://github.com/wtchg-kwiatkowski/observatory-web/issues/429)
        - [ ] Select a `colour-by-column column` from the `colour-by-column column-selector` to show a `categorical colour` for each of the `genome-browser-channel track-items` corresponding to the `distinct column values` in the selected `colour-by-column column` [observatory-web issue #337](https://github.com/wtchg-kwiatkowski/observatory-web/issues/337) (pocket-problems) ^
    - [x] See the `genome-browser track-items` (pocket-problems) ^
    - [x] (pocket-friendly) Click on a `genome-browser variants-channel track-item` to see the `variant page` for that `variant`
    - [ ] If you have a `pointer`, hover over the `genome-browser variants-channel track-item` to see the `genomic position` of that `variant` [observatory-web issue #339](https://github.com/wtchg-kwiatkowski/observatory-web/issues/339)
  - [x] See the `genome-browser global-fst-variant channel`
    - [ ] Click on the `close genome-browser-channel button` to close the `genome-browser variants channel` [observatory-web issue #134](https://github.com/wtchg-kwiatkowski/observatory-web/issues/134) (pocket-problems) [observatory-web issue #457](https://github.com/wtchg-kwiatkowski/observatory-web/issues/457)
    - [x] Click on the `genome-browser-channel settings-area icon-button` to toggle the appearance of the `genome-browser-channel settings-area` for the `genome-browser variants channel` (pocket-problems) [observatory-web issue #457](https://github.com/wtchg-kwiatkowski/observatory-web/issues/457)
      - If the `genome-browser-channel settings-area` is showing for the `genome-browser variants channel`:
        - [ ] Click on the `genome-browser-channel select genome-browser-channel-track button` to change the `genome-browser channel-tracks` for the `genome-browser channel` using the `genome-browser-channel-track-selector modal-dialog` [observatory-web issue #203](https://github.com/wtchg-kwiatkowski/observatory-web/issues/203) (pocket-problems) ^
        - [x] If no `table-filter` is in effect, click on the `add table-filter button` to add a `table-filter` to the `table` using the `construct-and-apply-table-filter modal-dialog` (pocket-problems) [observatory-web issue #429](https://github.com/wtchg-kwiatkowski/observatory-web/issues/429)
        - If a `table-filter` is in effect:
          - [ ] See the current `table-filter` [observatory-web issue #144](https://github.com/wtchg-kwiatkowski/observatory-web/issues/144) (pocket-problems) ^
          - [x] Click on the `change table-filter button` to change the `table-filter` using the `construct-and-apply-table-filter modal-dialog` (pocket-problems) [observatory-web issue #429](https://github.com/wtchg-kwiatkowski/observatory-web/issues/429)
        - [ ] See whether the `genome-browser-channel auto-y-scale feature` is `enabled` [observatory-web issue #145](https://github.com/wtchg-kwiatkowski/observatory-web/issues/145) [observatory-web issue #186](https://github.com/wtchg-kwiatkowski/observatory-web/issues/186) (pocket-problems) ^
        - [x] Click on the `genome-browser-channel auto-y-scale feature-checkbox` to toggle the `genome-browser-channel auto-y-scale feature` (pocket-problems) ^
        - [x] If the `genome-browser-channel auto-y-scale feature` is `enabled`, see that the `genome-browser-channel track-area` has an `automatically scaled y-axis` (pocket-problems) ^
        - If the `genome-browser-channel auto-y-scale feature` is `disabled`:
          - [ ] Specify the `y-axis minimum value` for the `genome-browser-channel track-area` [observatory-web issue #340](https://github.com/wtchg-kwiatkowski/observatory-web/issues/340) (pocket-problems) ^
          - [x] Specify the `y-axis maximum value` for the `genome-browser-channel track-area` (pocket-problems) ^
    - [x] (pocket-friendly) See the selected `genome-browser channel-tracks` for the `genome-browser channel`
      - [ ] See the `genome-browser-channel-track data` for each `genome-browser channel-track` for the `genome-browser chromosome-region being displayed` [observatory-web issue #142](https://github.com/wtchg-kwiatkowski/observatory-web/issues/142)
      - [x] (pocket-friendly) See the `genome-browser-channel y-axis tick-values`
    - [ ] Click on the `genome-browser-channel information icon-button` to toggle the appearance of the `genome-browser-channel information` for the `genome-browser global-fst-variant channel` [observatory-web issue #139](https://github.com/wtchg-kwiatkowski/observatory-web/issues/139) (pocket-problems) [observatory-web issue #457](https://github.com/wtchg-kwiatkowski/observatory-web/issues/457)
      - If the `genome-browser-channel information` is showing:
        - [ ] See a `genome-browser track-colour legend` for each `genome-browser channel-track` [observatory-web issue #341](https://github.com/wtchg-kwiatkowski/observatory-web/issues/341) (pocket-problems) ^
- [x] See any channels that you added using the `genome-browser channel-adder modal-dialog` (pocket-problems) [observatory-web issue #440](https://github.com/wtchg-kwiatkowski/observatory-web/issues/440)
  - For any `genome-browser channel being displayed`:
    - [ ] Click on the `close genome-browser-channel button` to close the `genome-browser variants channel` [observatory-web issue #134](https://github.com/wtchg-kwiatkowski/observatory-web/issues/134) (pocket-problems) [observatory-web issue #457](https://github.com/wtchg-kwiatkowski/observatory-web/issues/457)
    - [x] Click on the `genome-browser-channel settings-area icon-button` to toggle the appearance of the `genome-browser-channel settings-area` for the `genome-browser channel` (pocket-problems) [observatory-web issue #457](https://github.com/wtchg-kwiatkowski/observatory-web/issues/457)
    - [x] (pocket-friendly) If the channel has `selectable tracks`, see the selected `genome-browser channel-tracks` for the `genome-browser channel`
      - [ ] See the `genome-browser-channel-track data` for each `genome-browser channel-track` for the `genome-browser chromosome-region being displayed` [observatory-web issue #142](https://github.com/wtchg-kwiatkowski/observatory-web/issues/142)
      - [x] (pocket-friendly) See the `genome-browser-channel y-axis tick-values`
    - [ ] Click on the `genome-browser-channel information icon-button` to toggle the appearance of the `genome-browser-channel information` for the `genome-browser channel` [observatory-web issue #139](https://github.com/wtchg-kwiatkowski/observatory-web/issues/139)
    - If the `genome-browser-channel information` is showing:
      - [ ] See a `genome-browser track-colour legend` for each `genome-browser channel-track` [observatory-web issue #341](https://github.com/wtchg-kwiatkowski/observatory-web/issues/341) (pocket-problems) ^
    - If the `genome-browser channel being displayed` contains `genome-browser channel-tracks` relating to `number-type columns` that do not contain `categorical values`:
      - [ ] See `plotted points` [observatory-web issue #344](https://github.com/wtchg-kwiatkowski/observatory-web/issues/344)
      - If the `genome-browser-channel settings-area` is showing for the `genome-browser channel`:
        - [ ] Click on the `genome-browser-channel select genome-browser-channel-track button` to change the `genome-browser channel-tracks` for the `genome-browser channel` using the `genome-browser-channel-track-selector modal-dialog` [observatory-web issue #203](https://github.com/wtchg-kwiatkowski/observatory-web/issues/203)
        - [x] If no `table-filter` is in effect, click on the `add table-filter button` to add a `table-filter` to the `table` using the `construct-and-apply-table-filter modal-dialog` (pocket-problems) [observatory-web issue #429](https://github.com/wtchg-kwiatkowski/observatory-web/issues/429)
        - If a `table-filter` is in effect:
          - [ ] See the current `table-filter` [observatory-web issue #144](https://github.com/wtchg-kwiatkowski/observatory-web/issues/144) (pocket-problems) ^
          - [x] Click on the `change table-filter button` to change the `table-filter` using the `construct-and-apply-table-filter modal-dialog` (pocket-problems) ^
        - [ ] See whether the `genome-browser-channel auto-y-scale feature` is `enabled` [observatory-web issue #145](https://github.com/wtchg-kwiatkowski/observatory-web/issues/145) [observatory-web issue #186](https://github.com/wtchg-kwiatkowski/observatory-web/issues/186) (pocket-problems) ^
        - [x] Click on the `genome-browser-channel auto-y-scale feature-checkbox` to toggle the `genome-browser-channel auto-y-scale feature` (pocket-problems) ^
        - [x] If the `genome-browser-channel auto-y-scale feature` is `enabled`, see that the `genome-browser-channel track-area` has an `automatically scaled y-axis` (pocket-problems) ^
        - If the `genome-browser-channel auto-y-scale feature` is `disabled`:
          - [ ] Specify the `y-axis minimum value` for the `genome-browser-channel track-area` [observatory-web issue #340](https://github.com/wtchg-kwiatkowski/observatory-web/issues/340) (pocket-problems) ^
          - [x] Specify the `y-axis maximum value` for the `genome-browser-channel track-area` (pocket-problems) ^
    - If you have a `pointer`:
      - [x] If you have a `scroll-wheel`, scroll up and down while hovering over the `genome-browser-channel plotted area` to zoom in and out
      - [x] Drag left and right while hovering over the `genome-browser-channel plotted area` to scroll left and right
      - [x] See a `cross-channel plotted-item-value line` while hovering over the `genome-browser-channel plotted area`
      - [x] See the `plotted-item value` of all `plotted-items` in all `genome-browser channels` at the same position as (falling in line with) the `cross-channel plotted-item-value line`
      - [x] See the `plotted-item value` while hovering over a `plotted-item`
      - [x] See the `plotted item value` while hovering near a `plotted-item`
      - [x] Click on a `genome-browser track-colour colour-swatch` in the `genome-browser track-colour legend` to select a different `genome-browser track-colour` for each `genome-browser channel-track`

### From the `genome-browser-channel-track-selector modal-dialog`
- [x] See a `genome-browser channel-track-selector search textbox` (pocket-problems) [observatory-web issue #459](https://github.com/wtchg-kwiatkowski/observatory-web/issues/459)
  - [x] Type into `genome-browser channel-track-selector search textbox` to restrict the `list of genome-browser channel-tracks` to those that match the specified `search-text` (pocket-problems) ^
    - [x] See the matching text highlighted in the `list of genome-browser channel-tracks` (pocket-problems) ^
- [x] See the `list of genome-browser channel-tracks` (pocket-problems) [observatory-web issue #459](https://github.com/wtchg-kwiatkowski/observatory-web/issues/459)
  - For each `genome-browser channel-track`:
    - [x] See the `channel-track label` (pocket-problems) ^
    - [x] See the `channel-track data-type icon` (pocket-problems) ^
    - [x] Click on the `channel-track label` or `channel-track data-type icon` to add that `genome-browser channel-track` to the `list of genome-browser channel-tracks to display` (pocket-problems) ^
- [x] Click on the `display list-of-genome-browser-channel-tracks button` to display the `list of genome-browser channel-tracks to display` in the `genome-browser channel` (pocket-problems) [observatory-web issue #459](https://github.com/wtchg-kwiatkowski/observatory-web/issues/459)
- [x] Click on the `clear list-of-genome-browser-channel-tracks button` to clear the `list of genome-browser channel-tracks to display` (pocket-problems) [observatory-web issue #459](https://github.com/wtchg-kwiatkowski/observatory-web/issues/459)
- [ ] Click on the `cancel-and-close modal-dialog button` to cancel and close the `modal-dialog` [observatory-web issue #148](https://github.com/wtchg-kwiatkowski/observatory-web/issues/148)

### From the `genome-browser channel-adder modal-dialog`
- [x] See a `genome-browser channel-adder search textbox` (pocket-problems) [observatory-web issue #440](https://github.com/wtchg-kwiatkowski/observatory-web/issues/440)
  - [x] Type into `genome-browser channel-adder search textbox` to restrict the `list of genome-browser channels` to those that match the specified `search-text` (pocket-problems) ^
    - [x] See the matching text highlighted in the `list of genome-browser channels` (pocket-problems) ^
- [x] See the `list of genome-browser channels` (pocket-problems) [observatory-web issue #440](https://github.com/wtchg-kwiatkowski/observatory-web/issues/440)
  - For each `genome-browser channel`:
    - [x] See the `channel label` (pocket-problems) ^
    - [x] See the `channel data-type icon` (pocket-problems) ^
    - [x] For any `channel label` that is not self-explanatory, see the `channel description` (pocket-problems) ^
    - [x] Click on the `channel label`,  `channel description` or `channel data-type icon` to add that `genome-browser channel` to the `list of genome-browser channels to add` (pocket-problems) ^
- [x] Click on the `add list-of-genome-browser-channels button` to add the `list of genome-browser channels to add` to the `genome-browser`
- [x] Click on the `clear list-of-genome-browser-channels button` to clear the `list of genome-browser channels to add` (pocket-problems) [observatory-web issue #440](https://github.com/wtchg-kwiatkowski/observatory-web/issues/440)
- [ ] Click on the `cancel-and-close modal-dialog button` to cancel and close the `modal-dialog` [observatory-web issue #148](https://github.com/wtchg-kwiatkowski/observatory-web/issues/148)

____________________________________________

Components
----------

Quoted items are referred to in the **Features** section.

Items that are not quoted are only for organisational purposes, and are not actually referred to elsewhere in this document.

- user journey
  - `first-visit`
  - `refreshed-after-cookies-refused`
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
    - `top-horizontal-menu log in button`
    - `top-horizontal-menu log in button`
    - `log in page`
    - `hamburger-menu log out button`
    - `hamburger-menu log out button`
    - `log out page`
  - main-menu
    - `top-horizontal-menu buttons`
      - `top-horizontal-menu home button`
      - `top-horizontal-menu articles button`
      - `top-horizontal-menu analyses button`
      - `top-horizontal-menu data button`
    - `hamburger-menu button`
      - `hamburger-menu buttons`
    - `analyses top-horizontal-submenu`
      - `analyses top-horizontal-submenu drug-resistance-in-pf button`
        - `analyses top-horizontal-submenu pf-antimalarial-drugs button`
        - `analyses top-horizontal-submenu pf-rdt-evasion button`
        - `analyses top-horizontal-submenu pf-geographic-regions button`
        - `analyses top-horizontal-submenu pf-resistance-genes button`
        - `analyses top-horizontal-submenu pf-resistance-map button`
    - `data top-horizontal-submenu`
      - `data top-horizontal-submenu pf6-release button`
        - `data top-horizontal-submenu pf6-sample-table button`
        - `data top-horizontal-submenu pf6-variant-table button`
  - `side-menu`
    - `collapse side-menu button`
  - `footer`
    - `footer about button`
    - `footer cookies button`
    - `footer data-last-updated date` 
- _webapp's home address_
- cookies
  - `cookies consent request`
  - `cookies consent button`
  - `cookies statement button`
  - `cookies statement`
- `MalariaGEN Analytics logo`
- `home page`
- about MalariaGEN Analytics
  - `about MalariaGEN Analytics button`
  - `about MalariaGEN Analytics page`
  - `about dataset button`
  - `MalariaGEN website data page`
  - `about metrics button`
  - `about MalariaGEN button`
  - `MalariaGEN website home page`
  - `MalariaGEN Analytics contact details`
- `scientific publications and technical reports`
  - `scientific publications and technical reports button`
  - `scientific publications and technical reports page`
    - `pf6-report button`
    - `pf6-report page`
- `articles`
  - `articles button`
  - `all articles button`
  - `articles page`
  - `read-more button`
  - `article page`
  - `article categories`
  - `article category checkboxes`
  - `article-list-items`
    - `article-list-item`
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
    - `article dynamic content as intended`
- `analyses`
  - `analyses button`
  - `antimalarial-drugs that MalariaGEN Analytics predicts the resistance status for`
    - `list of antimalarial-drugs`
    - `pf-antimalarial-drugs button`
    - `pf-antimalarial-drugs page`
    - `antimalarial-drug`
      - `antimalarial-drug name`
      - `antimalarial-drug short-description`
      - `antimalarial-drug resistance description`
      - `antimalarial-drug button`
      - `antimalarial-drug page`
      - `all antimalarial-drugs geographic-map`
        - `all antimalarial-drugs geographic-map page`
        - `all antimalarial-drugs geographic-map introduction`
        - `all antimalarial-drugs geographic-site markers`
          - `all antimalarial-drugs geographic-site marker`
            - `all antimalarial-drugs geographic-site marker legend`
          - `key for the antimalarial-drugs markers`
            - `antimalarial-drug marker key icon`
        - `all antimalarial-drugs geographic-map for the geographic-site`
      - `antimalarial-drug geographic-map`
        - `antimalarial-drug geographic-map introduction`
        - `antimalarial-drug geographic-map button`
        - `antimalarial-drug geographic-map page`
      - `combination-therapy geographic-map`
        - `combination-therapy geographic-map introduction`
        - `combination-therapy geographic-map button`
        - `combination-therapy geographic-map page`
      - `pf-resistance-map page`
        - `all antimalarial-drugs geographic-map option`
        - `list of antimalarial-drugs as map options`
        - `antimalarial-drug geographic-map option`
        - `list of combination-therapies as map options`
        - `combination-therapy geographic-map option`
      - antimalarial-drug resistance
        - `antimalarial-resistance prediction introduction`
        - `legend for the antimalarial-drug resistance-status colour-gradation`
        - `legend for the combination-therapy-resistance-status colour-gradation`
        - `colour-gradated bar-chart of antimalarial-drug resistance as proportion-of-samples for the the full list of geographic-regions for the antimalarial-drug`
        - `antimalarial-drug resistance-status colour-gradation`
        - `predicted percentage of antimalarial-drug resistance`
        - `predicted proportion of antimalarial-drug resistance`
        - antimalarial-drug resistance in geographic-region
          - `antimalarial-drug in geographic-region summary`
          - `antimalarial-drug in geographic-region status`
          - `antimalarial-drug resistance in geographic-region button`
          - `antimalarial-drug resistance in geographic-region page`
          - `antimalarial-drug resistance in geographic-region barchart`
            - `antimalarial-drug resistance in geographic-region barchart introduction`
            - `antimalarial-drug resistance in geographic-region barchart total counts explanation`
        - `antimalarial-drug resistance by geographic-region barchart`
          - `antimalarial-drug resistance by geographic-region barchart introduction`
          - `antimalarial-drug resistance by geographic-region barchart total counts explanation`
        - `antimalarial-drug resistance by geographic-site barchart`
          - `antimalarial-drug resistance by geographic-site barchart introduction`
          - `antimalarial-drug resistance by geographic-site barchart total counts explanation`
        - `antimalarial-drug resistance genes`
          - `pf-antimalarial-drug resistance genes button`
          - `pf-antimalarial-drug resistance genes page`
            - `genes that MalariaGEN Analytics says are involved in antimalarial-drug resistance`
          - `antimalarial-drug resistance gene`
            - `antimalarial-drug resistance gene short-name`
            - `antimalarial-drug resistance gene long-name`
            - `antimalarial-drug resistance gene short-description`
            - `antimalarial-drug resistance gene long-description`
            - `antimalarial-drug resistance gene button`
            - `antimalarial-drug resistance gene page`
            - `antimalarial-drug resistance gene variation description`
            - `antimalarial-drug resistance gene alias-names`
            - `antimalarial-drug resistance gene codon-positions`
            - `antimalarial-drug resistance gene table`
              - `antimalarial-drug resistance gene amino-acid changes, interpretations and phenotypes`
              - `notes for the antimalarial-drug resistance gene table`
              - `references for the antimalarial-drug resistance gene table`
            - antimalarial-drug resistance genetic variants
              - `antimalarial-drug resistance genetic variants-table button`
              - `antimalarial-drug resistance genetic variants-table page`
              - `antimalarial-drug resistance genetic variant`
                - `antimalarial-drug resistance genetic variant amino-acid change`
                - `antimalarial-drug resistance genetic variant amino-acid position`
                - `colour-gradated antimalarial-drug resistance genetic variant non-reference allele frequency for each geographic-region`
              - `genetic variant page`
                - `genetic variant amino-acid change`
                - `genetic variant chromosome`
                - `genetic variant chromosomal position`
                - `genetic variant gene`
                - `genetic variant gene link`
                - `genetic variant allele-frequencies map`
                - `legend for the genetic variant allele-frequency colours`
  - `table of resistance statuses for the full list of antimalarial-drugs and the full list of geographic-regions`
    - `antimalarial-drug resistance-status colour-gradated spot`
    - `predicted percentage of antimalarial-drug resistance in geographic-region tooltip`
  - antimalarial-drug in geographic-region
    - `antimalarial-drug in geographic-region page`
    - `antimalarial-drug in geographic-region button`
  - combination-therapies
    - `combination-therapies that MalariaGEN Analytics predicts the resistance status for`
    -  `combination-therapy`
        - `combination-therapy name`
        - `combination-therapy short-description`
        - `combination-therapy button`
        - `combination-therapy page`
        - `combination-therapy resistance description`
        - `combination-therapy resistance genes`
          - `combination-therapy resistance gene`
            - `combination-therapy resistance gene button`
            - `combination-therapy-resistance gene page`
            - `combination-therapy resistance gene short-name`
            - `combination-therapy resistance gene alias-names`
            - `combination-therapy resistance gene codon-positions`
            - `combination-therapy resistance gene table`
              - `combination-therapy resistance gene amino-acid changes, interpretations and phenotypes`
              - `notes for the combination-therapy resistance gene table`
              - `references for the combination-therapy resistance gene table`
    - `table of resistance statuses for the full list of combination-therapies and the full list of geographic-regions`
    - `combination-therapy-resistance-status colour-gradated spot`
    - `predicted percentage of combination-therapy-resistance`
    - `combination-therapy in geographic-region page`
    - `legend for the combination-therapy-resistance-status colour-gradation`
    - `combination-therapy-resistance-status colour-gradation`
    - `combination-therapy geographic-map button`
    - `combination-therapy geographic-map page`
    - `combination-therapy resistance by geographic-region barchart`
      - `combination-therapy resistance by geographic-region barchart introduction`
      - `combination-therapy resistance by geographic-region barchart total counts explanation`
      - `predicted percentage of combination-therapy-resistance in geographic-region tooltip`
    - `combination-therapy-resistance in geographic-region page`
      - `combination-therapy in geographic-region summary`
      - `combination-therapy in geographic-region status`
      - `combination-therapy geographic-map`
    - `combination-therapy resistance by geographic-site barchart`
      - `combination-therapy resistance by geographic-site barchart introduction`
      - `combination-therapy resistance by geographic-site barchart total counts explanation`
  - rdt-evasion
    - `pf-rdt-evasion button`
    - `pf-rdt-evasion page`
      - `pf-rdt-evasion introduction`
      - evasion gene-sets
      - `table of pf-rdt-evasion statuses for the full list of evasion gene-sets and the full list of geographic-regions`
        - `pf-rdt-evasion colour-gradated spot`
        - `predicted percentage of pf-rdt-evasion`
      - `legend for the pf-rdt-evasion-status colour-gradation`
      - `pf-rdt-evasion-status colour-gradation`
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
    - `table-filter`
      - `add table-filter button`
      - `top-bar table-filter button`
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
    - `pf-resistance-map button`
    - `pf-resistance-map page`
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
    - `technical details about antimalarial-resistance prediction button`
    - `technical details about antimalarial-resistance prediction page`