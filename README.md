# FootballPulse

Final project for WEB Technologies 1, group IT-2512. FootballPulse is a six-page, responsive football site with light and dark modes, sourced 2026/27 league and player snapshots, and clearly labelled demo matchday features.

Live site: https://zharkyn077.github.io/FootballPulse/

## Run locally

Open `index.html` in a browser, or serve this folder with a local static server. The site uses no build step or backend. Bootstrap, jQuery and Google Fonts load from CDNs, so an internet connection is needed for those resources.

## What visitors can do

- Follow a club, simulate a result and see a projected league position on Home.
- Save news articles, find them in the dedicated favourites area, and manage them from Home.
- Search and filter demo fixtures, save a watchlist and export calendar reminders.
- Sort and search the dated league table, compare two clubs and browse player portraits.
- Select a stand, validate a demo booking form and manage saved bookings.
- Choose a guided route through the site on About.

Theme, followed club, favourite articles, watchlist, bookings and route preference are stored as JSON or strings in the visitor's browser with `localStorage`. The demo does not create real accounts, sell tickets or send email. League and player figures are dated snapshots, not live feeds.

## Credits

Source links and data dates: [DATA_SOURCES.md](DATA_SOURCES.md). Player image licences: [IMAGE_CREDITS.md](IMAGE_CREDITS.md). The [About page](about.html#credits) credits the libraries, fonts, sources, inspirations and AI assistance used for the site. The academic report should also include these credits, team contributions, Endterm changes, screenshots and the live site link.
