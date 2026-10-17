# Visual QA: three passes

Each pass is the same ten screens: desktop at 1440 × 900, phone as a Pixel 7 (412 × 915), production build. The critique below is what each pass showed and what changed before the next.

## Pass 1 (`redesign-pass-1/`)

What worked: the light atlas palette, the floating editorial cards, the Journey Mode stop card (07 / 18 · PHILIPPI · references · verbatim line), the timeline rail, the Scripture-first answer card.

What did not:

1. **Opening map:** a tangle of thin blue lines with no place names. At a glance it did not read as "biblical journeys".
2. **Journey title page:** the one call to action, Begin Journey, sat below the fold.
3. **Second journey map:** in the crowded Macedonian cluster, Philippi's marker (stop 7), the key stop, was hidden under Neapolis.
4. **Search answer:** the map ignored the answer and kept showing the overview.
5. **Hero search:** the placeholder ("Search Paul, Jerusalem, Acts 16…") and long questions were cut off.
6. **Journey Mode camera:** off-centre by about 180 px. The cause was a feedback loop: the zoom controls counted as an obstacle and pushed the inset they are positioned by.
7. **Person maps:** Jerusalem sat on the bottom edge, and MapLibre's place names (Mount of Olives, Bethany) printed over the marker labels.
8. **Wording:** a "Where they appear" stat label; "About the name" on notes that are not about names; "the twelve" and "the Twelve" both used; Jesus's role repeating his name.
9. **People directory:** bordered cards with small counts read like a dashboard.

## Pass 2 (`redesign-pass-2/`)

Changes made after pass 1:

- The opening map names its best-known places (the most narrated settlements and the ends of routes).
- Begin Journey moved above the fold.
- Crowded stops keep the most narrated one visible.
- A search answer on the home screen moves the map to the stops it names.
- The hero placeholder fits.
- The inset feedback loop is fixed.
- An invisible "occupied" layer keeps MapLibre's labels clear of the HTML markers, and person maps get wider margins.
- The People directory is a ruled two-column index; pointing at a name marks that person's places on the map.
- In Journey Mode, the top bar's search and sections step back.
- The wording fixes from pass 1 are applied.

What remained:

1. The answer preview centred on Thessalonica so closely that Philippi, where the answer starts, sat at the edge.
2. Long names were cut off in the timeline rail ("THESSALON…").
3. Regions (Macedonia, Galilee) looked like towns on person maps.
4. The selected marker's two-line label covered the neighbouring marker (Apollonia).

## Pass 3 (`redesign-pass-3/`)

Changes made after pass 2:

- The answer preview frames every place the answer names.
- Rail names wrap, and long single words are set smaller.
- Regions are drawn as dashed areas.
- The selected label may sit above or below its marker.
- On person maps, a person's most narrated places stay visible: Philippi now shows rather than its port, Neapolis.
- Accessibility work also changed what is on screen:
  - full markers never overlap;
  - crowded markers shrink and leave the tab order;
  - dot markers have 24 px targets;
  - upcoming stop numbers are darker;
  - quotations became figures with a read button.

After pass 3, on windows narrower than 1280 px the timeline moved into the stop card, so the map is not squeezed between the card and the rail.

Still worth improving: the Holy Land cluster on the opening map is dense at that zoom, and on phones the expanded map attribution covers a strip of map until the map is first moved.

## After pass 3: the home screen's index

The home screen gained "Explore the atlas" between the search and Featured. It is four links in a ruled two-by-two index, each a count over a label: Journeys & collections, Places, People and Events. The counts are read from the data. Events has a new directory, `/events`.

The three screens that start on the home screen were re-shot in `redesign-pass-3/`: 01 shows the index, while 05 and 10 look as before, because a search answer takes the index's place.

- **Desktop, 1440 × 900.** The index adds 163 px. Featured now starts at 746 px, and its first journey is still fully in view: it ends at 877 px, the bottom edge of the card. It ended at 714 px before.
- **Phones.** On a Pixel 7, the half-open sheet now ends at the index's heading; Featured begins about 120 px lower, one short scroll.
- **Drafts that did not work.**
  - The count beside its label made "Journeys & collections" wrap onto two lines, so the rows were uneven.
  - A hover arrow inside the label took enough width to wrap it again.
  - The final layout sets the count above the label and draws the arrow outside the text, only on hover or keyboard focus.
- **On the map.** Pointing at Journeys & collections strengthens the routes, and pointing at Places fades them and dots every place. People and Events leave the map alone; 222 event markers would bury it.

## After review: Antioch, stops 1 and 18

Two problems with the marker of a place a journey visits twice:

1. **It read like a progress count.** Antioch, where the second journey starts and ends, was one pill reading "1 · 18". On an 18-stop journey whose card says "01 / 18", that looks like "stop 1 of 18".
   - Each visit is now its own numbered disc, (1)(18), and keeps its own state in Journey Mode.
   - At stop 1, disc 1 is current and 18 is still ahead; from stop 2 on, 1 is visited and 18 ahead.
   - The same applies to every place visited more than once, such as Perga (5)(13) on the first journey and Golgotha (11)(12) among the women's places.
   - Past four visits, a marker shows the current or next visit and a count, so Jerusalem in "Jerusalem in Acts" is (9)(+11) instead of a twelve-number pill.
2. **Begin Journey left Antioch hidden.** It opened stop 1 with Antioch behind the timeline.
   - The flight to the first stop was being stopped by the panels that arrive with Journey Mode: setting the map's padding is a jump, which ends a flight.
   - The flight is now redirected to the same framing for the new panels. Begin Journey, the next stop, opening a journey from the home screen and opening a person from the People directory now end where a fresh page load does.

All ten `redesign-pass-3/` images were re-shot from this build; 02 shows the new Antioch marker and 01 the label in sentence case ("Journeys & collections").
