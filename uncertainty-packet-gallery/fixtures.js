window.UNCERTAINTY_PACKET_FIXTURES = [
  {
    "id": "shared-roof",
    "label": "Shared roof repair",
    "status": "A packet with a focused conflict and two named checks.",
    "question": "What should the co-op inspect before scheduling a roof repair?",
    "claims": [
      {
        "text": "The leak follows wind-driven rain from the north-west.",
        "source": "Caretaker rain log \u00b7 12 May",
        "confidence": "medium",
        "stance": "agreement"
      },
      {
        "text": "The membrane is the likely entry point.",
        "source": "Contractor walk-through \u00b7 13 May",
        "confidence": "low",
        "stance": "conflict"
      },
      {
        "text": "The flashing is the likely entry point.",
        "source": "Resident photo set \u00b7 14 May",
        "confidence": "medium",
        "stance": "conflict"
      }
    ],
    "agreement": "Everyone observed water after north-west rain; nobody has opened the roof edge.",
    "conflict": "The contractor names the membrane. The photos make the flashing look more exposed.",
    "nextChecks": [
      "Photograph the north-west flashing after the next rain.",
      "Ask the contractor to inspect the edge with the resident photos present."
    ],
    "gaps": [
      "No interior moisture reading",
      "No roof-edge inspection"
    ]
  },
  {
    "id": "field-notes",
    "label": "Field notes without a baseline",
    "status": "A packet that keeps a promising observation separate from what is absent.",
    "question": "Did the new intake form reduce follow-up calls?",
    "claims": [
      {
        "text": "Staff report fewer repeated address questions.",
        "source": "Three shift notes \u00b7 3\u20135 June",
        "confidence": "medium",
        "stance": "agreement"
      },
      {
        "text": "Call time seems shorter on morning shifts.",
        "source": "Supervisor recollection \u00b7 5 June",
        "confidence": "low",
        "stance": "agreement"
      },
      {
        "text": "The change may only have moved questions to email.",
        "source": "Support mailbox sample \u00b7 6 June",
        "confidence": "low",
        "stance": "conflict"
      }
    ],
    "agreement": "The form changed what staff ask at the start of a call.",
    "conflict": "The observed relief may be a shift in channel, not less work overall.",
    "nextChecks": [
      "Count address-related calls and emails for one comparable week.",
      "Record the form version used on each sample."
    ],
    "gaps": [
      "No before-change baseline",
      "No total email count",
      "No customer account of the experience"
    ]
  },
  {
    "id": "quiet-sensor",
    "label": "Quiet sensor alert",
    "status": "A sparse packet where uncertainty is the main result, not a defect to hide.",
    "question": "Does the freezer sensor alert describe a temperature fault?",
    "claims": [
      {
        "text": "One alert arrived at 02:14 and cleared six minutes later.",
        "source": "Sensor event export \u00b7 18 July",
        "confidence": "high",
        "stance": "agreement"
      },
      {
        "text": "The freezer contents still felt cold at 08:00.",
        "source": "Opening shift note \u00b7 18 July",
        "confidence": "low",
        "stance": "agreement"
      }
    ],
    "agreement": "An alert occurred; a later manual observation did not find an obvious warm freezer.",
    "conflict": "There is no competing explanation yet \u2014 only too little evidence to choose one.",
    "nextChecks": [
      "Place an independent thermometer inside for 24 hours.",
      "Compare the next alert with door-open and defrost events."
    ],
    "gaps": [
      "No continuous temperature trace",
      "No door-open log",
      "No calibration record",
      "No contents temperature at alert time"
    ]
  }
];
