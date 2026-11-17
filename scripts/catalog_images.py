"""Photo map: product slug → Instagram frames "<post code>/<frame index>" (originals/ig/<code>/NN.jpg).
Frames of one colour sit back to back, in the order of `colors[].image` in src/lib/catalog/data.ts.
Optional gravity: ("CODE/NN", "t"|"b"|"c") for the 3:4 crop."""

PRODUCTS = {
  # ── autumn / winter 2026 ──
  "dober-dollar-longsleeve": ["Df1hp4tCAS9/00", "Df1hp4tCAS9/01", "Df1hp4tCAS9/02", "Df1hp4tCAS9/03",   # black 0–3
                              "Df1hp4tCAS9/04", "Df1hp4tCAS9/05"],                                         # white 4–5
  "sapfir-dress": ["Df1etrcCGby/00", "Df1etrcCGby/01", "Df1etrcCGby/03", "Df1etrcCGby/02"],
  "mesh-bodysuit": ["DfZRkARiE5J/01", "DfZRkARiE5J/00", "DfZRkARiE5J/02"],
  "open-back-suit": ["DfPPMlJAu2h/02", "DfPPMlJAu2h/01",                                                  # milk 0–1
                     "DfPPMlJAu2h/00"],                                                                    # black 2
  "home-hoodie": ["DfO4EnxiNas/08", "DfO4EnxiNas/01", "DfO4EnxiNas/05", "DfO4EnxiNas/06", "DfO4EnxiNas/04",
                  "DfO4EnxiNas/02", "DfO4EnxiNas/07", "DfO4EnxiNas/00", "DfO4EnxiNas/03"],
                  # black 0, milk 1, melange 2, graphite 3, chocolate 4, burgundy 5, red 6, pink 7, bottle 8
  "san-francisco-bomber": ["De9Bh7JiGqG/00", "De9Bh7JiGqG/04", "DcGG6GAArAV/02",                          # milk 0–2
                           "De9Bh7JiGqG/01", "DcGG6GAArAV/01",                                             # black 3–4
                           "De9Bh7JiGqG/02", "DcGG6GAArAV/00",                                             # beige 5–6
                           "De9Bh7JiGqG/03"],                                                              # chocolate 7
  "bloom-suit": ["De9AElSggJD/02", "De9AElSggJD/01",                                                      # milk 0–1
                 "De9AElSggJD/00",                                                                         # black 2
                 "De9AElSggJD/04", "De9AElSggJD/03"],                                                      # chocolate 3–4
  "personality-longsleeve": ["De6TZ8IgnjB/00", "De6TZ8IgnjB/01",                                          # melange 0–1
                             "De6TZ8IgnjB/03", "De6TZ8IgnjB/02",                                           # black 2–3
                             "De6TZ8IgnjB/05", "De6TZ8IgnjB/04"],                                          # milk 4–5
  "melansh-suit": ["Deths2Qghif/00", "Deths2Qghif/01", "Deths2Qghif/02", "Deths2Qghif/03"],
  "alpaca-three-piece": ["DeoqVvPglol/00", "DeoqVvPglol/03",                                               # milk 0–1
                         "DeoqVvPglol/01",                                                                 # chocolate 2
                         "DeoqVvPglol/02"],                                                                # black 3
  "faux-fur-jacket": ["Deoo5NLAjEk/00", "Deoo5NLAjEk/01",                                                 # light 0–1
                      "Deoo5NLAjEk/02"],                                                                   # dark 2
  "mini-kashemir-coat": ["DeomdU2Al4-/01", "DeomdU2Al4-/00", "DeomdU2Al4-/02"],
  "thermal-set": ["DeoI-3agnKH/00",                                                                        # black 0
                  "DeoI-3agnKH/01", "DeoI-3agnKH/02", "DeoI-3agnKH/04",                                    # pink 1–3
                  "DeoI-3agnKH/03"],                                                                       # chocolate 4
  "wrap-waist-jeans": ["DeYsiZJAl3Q/01", "DeYsiZJAl3Q/00", "DeYsiZJAl3Q/02", "DeYsiZJAl3Q/03", "DeYsiZJAl3Q/04"],
  "ruched-mini-dress": ["DeYrofpgpom/02", "DeYrofpgpom/03", "DeYrofpgpom/04", "DeYrofpgpom/00", "DeYrofpgpom/01"],
  "faux-fur-hood-jumpsuit": ["DdzBODXDEbO/00", "DdzBODXDEbO/01",                                           # white 0–1
                             "DdzBODXDEbO/02"],                                                            # black 2
  "open-back-bodysuit": ["DdzA836jGBR/00", "DdzA836jGBR/01"],
  "cashmere-bomber-coat": ["DdyCJdEAkl4/00", "DdyCJdEAkl4/01", "DdyCJdEAkl4/02",                           # beige 0–2
                           "DdyCJdEAkl4/06",                                                               # black 3
                           "DdyCJdEAkl4/05",                                                               # grey 4
                           "DdyCJdEAkl4/04",                                                               # chocolate 5
                           "DdyCJdEAkl4/03"],                                                              # burgundy 6
  "nylon-track-suit": ["DdggepEAgRd/00", "DdggepEAgRd/02", "DdggepEAgRd/01", "DdggepEAgRd/03"],
  "fleece-piping-suit": ["Dda9KJJgioy/02", "Dda9KJJgioy/00", "Dda9KJJgioy/01", "Dda9KJJgioy/03"],
  "two-tone-suit": ["Dda8ruMgpIW/03", "Dda8ruMgpIW/00", "Dda8ruMgpIW/01", "Dda8ruMgpIW/02"],
  "belted-trench-coat": ["Dda7T3cAmLv/00", "Dda7T3cAmLv/01",                                               # beige 0–1
                         "Dda7T3cAmLv/02", "Dda7T3cAmLv/03"],                                              # black 2–3
  "prime-era-suit": ["Dda5Jb1guOU/00", "Dda5Jb1guOU/01", "Dda5Jb1guOU/02",                                 # melange 0–2
                     "Dda5Jb1guOU/03",                                                                     # chocolate 3
                     "Dda5Jb1guOU/04",                                                                     # graphite 4
                     "Dda5Jb1guOU/05",                                                                     # milk 5
                     "Dda5Jb1guOU/06"],                                                                    # black 6
  "lace-shirt": ["DdXCRRIgow2/00", "DdXCRRIgow2/01", "DdXCRRIgow2/04", "DdXCRRIgow2/02", "DdXCRRIgow2/03"],
  "knit-zip-suit": ["DdTYwwmgoRz/03", "DcOIMyHgjrH/00", "DdTYwwmgoRz/01", "DdTYwwmgoRz/02",              # grey 0–3
                    "DcOIMyHgjrH/04", "DcOIMyHgjrH/03",                                                    # black 4–5
                    "DcOIMyHgjrH/05", "DcOIMyHgjrH/06",                                                    # milk 6–7
                    "DcOIMyHgjrH/07", "DcOIMyHgjrH/08"],                                                   # chocolate 8–9
  "cropped-zip-sweater": ["DdTYORggrIC/02", "DdTYORggrIC/00", "DdTYORggrIC/01",                            # black 0–2
                          "DdTYORggrIC/03", "DdTYORggrIC/05",                                              # beige 3–4
                          "DdTYORggrIC/06",                                                                # milk 5
                          "DdTYORggrIC/07",                                                                # red 6
                          "DdTYORggrIC/08", "DdTYORggrIC/04"],                                             # burgundy 7–8
  "seam-wide-jeans": ["DdOPseEgsUZ/00", "DdOPseEgsUZ/01", "DdOPseEgsUZ/03", "DdOPseEgsUZ/02", "DdOPseEgsUZ/04"],
  "tie-cropped-blazer": ["DdD5XwgAtCm/03", "DdD5XwgAtCm/02", "DdD5XwgAtCm/00", "DdD5XwgAtCm/01",           # black 0–3
                         "DdD5XwgAtCm/04",                                                                 # white 4
                         "DdD5XwgAtCm/05"],                                                                # chocolate 5
  "train-mini-dress": ["DdBM-UWgkyo/02", "DdBM-UWgkyo/00", "DdBM-UWgkyo/01"],
  "velour-flare-suit": ["DdBLdiUAobS/02", "DdBLdiUAobS/00", "DdBLdiUAobS/01",                              # grey 0–2
                        "DdBLdiUAobS/03", "DdBLdiUAobS/04",                                                # white 3–4
                        "DdBLdiUAobS/05", "DdBLdiUAobS/06"],                                               # black 5–6
  "trench-skirt-set": ["DdBKWA8Aii5/02", "DdBKWA8Aii5/01", "DdBKWA8Aii5/00", "DdBKWA8Aii5/03"],
  "satin-corset": ["Dc5lDKeArvD/00", "Dc5lDKeArvD/01",                                                     # black 0–1
                   "Dc5lDKeArvD/03", "Dc5lDKeArvD/04",                                                     # milk 2–3
                   "Dc5lDKeArvD/02"],                                                                      # red 4
  "fur-cuff-coat": ["Dc3GhrmghvA/05", "Dc3GhrmghvA/00", "Dc3GhrmghvA/06",                                  # milk 0–2
                    "Dc3GhrmghvA/02", "Dc3GhrmghvA/03", "Dc3GhrmghvA/01",                                  # black 3–5
                    "Dc3GhrmghvA/04",                                                                      # chocolate 6
                    "Dc3GhrmghvA/07"],                                                                     # grey 7
  "crinkle-track-suit": ["Dc3FjPTAtQr/02", "Dc3FjPTAtQr/00", "Dc3FjPTAtQr/01",                             # white 0–2
                         "Dc3FjPTAtQr/06", "Dc3FjPTAtQr/05", "Dc3FjPTAtQr/07",                             # black 3–5
                         "Dc3FjPTAtQr/03", "Dc3FjPTAtQr/04"],                                              # navy 6–7
  "lace-hem-trench": ["Dc3ALA-AoJV/00", "Dc3ALA-AoJV/01",                                                  # beige 0–1
                      "Dc3ALA-AoJV/02",                                                                    # chocolate 2
                      "Dc3ALA-AoJV/03"],                                                                   # black 3
  "organza-shirt": ["DcvijkQgii1/00", "DcvijkQgii1/01", "DcvijkQgii1/02",                                  # white 0–2
                    "DcvijkQgii1/03",                                                                      # black 3
                    "DcvijkQgii1/04"],                                                                     # blue 4
  "piping-denim-bomber": ["DcTXcXggua9/03", "DcTXcXggua9/02", "DcTXcXggua9/04",                            # denim 0–2
                          "DcTXcXggua9/05", "DcTXcXggua9/06", "DcTXcXggua9/00"],                           # milk 3–5
  "jacket-shorts-suit": ["DcTDcVxAoa3/00", "DcTDcVxAoa3/01",                                               # milk 0–1
                         "DcTDcVxAoa3/02",                                                                 # black 2
                         "DcTDcVxAoa3/03"],                                                                # pink 3
  "faux-leather-top": ["DcTBzCcgti6/02", "DcTBzCcgti6/00", "DcTBzCcgti6/01"],
  "plush-flare-suit": ["DcQNncmAiBZ/05",                                                                   # black 0
                       "DcQNncmAiBZ/03", "DcQNncmAiBZ/04",                                                 # grey 1–2
                       "DcQNncmAiBZ/00", "DcQNncmAiBZ/01", "DcQNncmAiBZ/02"],                              # barbie 3–5
  "lace-skirt-suit": ["DcQMk_PAoMF/00", "DcQMk_PAoMF/01", "DcQMk_PAoMF/02", "DcQMk_PAoMF/03"],
  "lace-corset": ["DcGuWRbgotZ/01", "DcGuWRbgotZ/02", "DcGuWRbgotZ/00",                                    # black 0–2
                  "DcGuWRbgotZ/03"],                                                                       # cream 3
  "velour-stripe-pants": ["DbndAKWAt3u/02",                                                                # black 0
                          "DbndAKWAt3u/03",                                                                # red 1
                          "DbndAKWAt3u/01", "DbndAKWAt3u/00",                                              # pink 2–3
                          "DbndAKWAt3u/04"],                                                               # navy 4
  "oversized-blazer": ["DbnTE6OgryV/02", "DbnTE6OgryV/00", "DbnTE6OgryV/01", "DbnTE6OgryV/03",             # black 0–3
                       "DbnTE6OgryV/04", "DbnTE6OgryV/05",                                                 # graphite 4–5
                       "DbnTE6OgryV/06"],                                                                  # bordeaux 6
  # ── summer / evening ──
  "silk-slip-dress": ["DbVEjwMgniF/03", "DbVEjwMgniF/04",                                                  # black 0–1
                      "DbVEjwMgniF/00",                                                                    # milk 2
                      "DbVEjwMgniF/02", "DbVEjwMgniF/05", "DbVEjwMgniF/01"],                               # chocolate 3–5
  "basque-corset-dress": ["DakDEgzAgOU/00", "DakDEgzAgOU/01",                                              # black dot 0–1
                          "DakDEgzAgOU/02", "DakDEgzAgOU/03", "DakDEgzAgOU/04"],                           # white dot 2–4
  "satin-three-piece": ["DZmXLIlAnOJ/04", "DZmXLIlAnOJ/03",                                                # black 0–1
                        "DZmXLIlAnOJ/01", "DZmXLIlAnOJ/02",                                                # milk 2–3
                        "DZmXLIlAnOJ/00"],                                                                 # chocolate 4
  "silk-cowl-top": ["DZiRT6vgq_a/03",                                                                      # black 0
                    "DZiRT6vgq_a/02",                                                                      # milk 1
                    "DZiRT6vgq_a/05",                                                                      # beige 2
                    "DZiRT6vgq_a/00", "DZiRT6vgq_a/01",                                                    # brown 3–4
                    "DZiRT6vgq_a/04",                                                                      # pink 5
                    "DZiRT6vgq_a/06"],                                                                     # blue 6
  "peony-dress": ["DYzIsCbApkC/00", "DYzIsCbApkC/01", "DYzIsCbApkC/02"],
  "slit-maxi-dress": ["DYjsjadAtTb/03",                                                                    # black 0
                      "DYjsjadAtTb/02", "DYjsjadAtTb/01", "DYjsjadAtTb/00",                                # milk 1–3
                      "DYjsjadAtTb/04",                                                                    # red 4
                      "DYjsjadAtTb/05",                                                                    # blue 5
                      "DYjsjadAtTb/06",                                                                    # yellow 6
                      "DYjsjadAtTb/07"],                                                                   # orange 7
}

# Editorial photos (public/images/editorial/<name>.jpg) — full frame, 3:4
EDITORIAL = {
  # hero slides
  "hero-coat": "Dc3GhrmghvA/02", "hero-coat-2": "Dc3GhrmghvA/05",
  "hero-alpaca": "DeoqVvPglol/00", "hero-alpaca-2": "DeoqVvPglol/02",
  "hero-bloom": "De9AElSggJD/00", "hero-bloom-2": "De9AElSggJD/02",
  "hero-sapfir": "Df1etrcCGby/00", "hero-sapfir-2": "Df1etrcCGby/03",
  # capsules
  "grey-mood": "DcGG6GAArAV/00", "date-night": "DdzA836jGBR/00", "chocolate": "De9AElSggJD/03",
  "office": "DbnTE6OgryV/02", "evening": "Df1etrcCGby/01", "milk": "Dc3GhrmghvA/05",
  # features / about / instagram marquee
  "home-hoodie": "DfO4EnxiNas/01", "home-hoodie-2": "DfO4EnxiNas/07",
  "knit": "DcOIMyHgjrH/05", "knit-2": "DcOIMyHgjrH/07",
  "about": "DeoqVvPglol/01", "about-2": "Dda5Jb1guOU/03",
  "ig-1": "Dc3GhrmghvA/03", "ig-2": "De6TZ8IgnjB/04", "ig-3": "DdyCJdEAkl4/05", "ig-4": "DbVEjwMgniF/05",
  "ig-5": "DdBLdiUAobS/03", "ig-6": "Dc3FjPTAtQr/05", "ig-7": "DcTXcXggua9/01", "ig-8": "DdD5XwgAtCm/03",
  "ig-9": "DYjsjadAtTb/04", "ig-10": "DdTYORggrIC/07", "ig-11": "Dda7T3cAmLv/00", "ig-12": "DcTDcVxAoa3/03",
}
