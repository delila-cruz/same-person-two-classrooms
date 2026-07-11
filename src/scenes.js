// scenes.js
// All narrative content for "Same Person, Two Classrooms."
// This is the only file in the project that contains story copy.
// Every other module reads from SCENES and renders it — no prose belongs anywhere else.

export const SCENES = [
  {
    id: 'title',
    type: 'title',
    title: 'Claim/Evidence/Reasoning',
    subtitle: 'a game about literacy',
  },

  {
    id: 'premise',
    type: 'narration',
    text:
      "What you're about to watch is one life, shown twice.\n\n" +
      "Same parents. Same house. Same report cards in every subject but one. Same body, " +
      "years later, doing the same job.\n\n" +
      "There is exactly one difference between the two of them, and it happens early: which " +
      "room they were sitting in at age nine when it was time to learn how to write a sentence " +
      "that means what it says.\n\n" +
      "Everything else is identical.",
  },

  {
    id: 'beat1',
    type: 'staggeredNarration',
    left: {
      text:
        "Room 204 smells like dry-erase marker and the radiator ticking on. Ms. Alvarez writes " +
        "a sentence on the board and then takes it apart in front of you, word by word, like it's " +
        "an engine. Claim. Evidence. So what.\n\n" +
        "You write a paragraph about why your neighborhood's park should have a working water " +
        "fountain. She hands it back with three lines in the margin, none of them just \"good job.\" " +
        "One says: this is your best sentence — put it first.\n\n" +
        "You don't know yet that this is a skill. It just feels like being taken seriously.",
    },
    right: {
      text:
        "Room 118 has thirty-one desks and no permanent teacher — Ms. Alvarez's counterpart quit " +
        "in October and nobody's been hired since. Today, like most Fridays, the sub wheels in the " +
        "cart and puts a movie on.\n\n" +
        "The lights go off. Somebody's phone glows two rows up. You copy the vocabulary words off " +
        "the board because that's what's due Monday, but no one asks you to use them in a sentence " +
        "that means something.\n\n" +
        "You are not being punished. You are just not quite being taught.",
    },
    staggerDelayMs: 1500,
  },

  {
    id: 'beat2',
    type: 'lockedChoice',
    prompt:
      "Years later: the coffee maker finally gives out, mid-brew, on a Tuesday. You open the " +
      "same AI shopping assistant everyone uses now and start typing.",
    left: {
      options: [
        {
          text:
            "\"I need a drip coffee maker under $60 that brews a full pot in under 10 minutes and " +
            "has a permanent filter — can you find a few options and compare them?\"",
          locked: false,
        },
        {
          text: "\"Help me find a coffee maker.\"",
          locked: false,
        },
      ],
      resultGood: null,
      resultWeak: null,
    },
    right: {
      options: [
        {
          text:
            "\"I need a drip coffee maker under $60 that brews a full pot in under 10 minutes and " +
            "has a permanent filter — can you find a few options and compare them?\"",
          locked: true,
        },
        {
          text: "\"Can you help me pick a coffee maker.\"",
          locked: false,
        },
      ],
      resultGood: null,
      resultWeak: null,
    },
    resultGood:
      "\"Here are three under $60 with permanent filters and sub-10-minute brew times: the " +
      "Hamilton Beach FlexBrew ($44, 12-cup, 4.4 stars), the BLACK+DECKER 12-Cup ($35, 4.2 stars), " +
      "and the Mr. Coffee Simple Brew ($30, 4.3 stars, fastest brew time of the three). Want a " +
      "closer comparison on any of them?\"",
    resultWeak:
      "\"There are a lot of coffee makers out there — drip, single-serve, French press, and more. " +
      "Popular brands include Hamilton Beach, Mr. Coffee, and Keurig. Let me know if you'd like more " +
      "specific recommendations!\"",
  },

  {
    id: 'climaxSetup',
    type: 'narration',
    text:
      "Twenty years on. Same age, same week: a sharp pain that doesn't pass sends each of them " +
      "to the ER, then to a specialist, then to a procedure the specialist says can't wait.\n\n" +
      "The bill comes to both of them wearing the same words: Claim Denied. Reason: Not medically " +
      "necessary per plan guidelines.\n\n" +
      "Both of them have thirty days to answer it. Both of them open the same tool.",
  },

  {
    id: 'climaxDrafting',
    type: 'multiRoundLockedChoice',
    rounds: [
      {
        label: 'Your Claim',
        leftOptions: [
          {
            text:
              "\"I am formally appealing the denial of claim #[number], dated [date], on the " +
              "grounds that the denial does not reflect the documented medical necessity of the " +
              "procedure.\"",
            locked: false,
          },
          {
            text:
              "\"I am writing to appeal the denial of my claim and to request a full review of " +
              "the decision under my plan's internal appeals process.\"",
            locked: false,
          },
          {
            text: "\"I am appealing this denial and disagree with the decision that was made.\"",
            locked: false,
          },
          {
            text: "\"This letter is regarding my denied claim, which I am appealing.\"",
            locked: false,
          },
        ],
        rightOptions: [
          {
            text:
              "\"I am formally appealing the denial of claim #[number], dated [date], on the " +
              "grounds that the denial does not reflect the documented medical necessity of the " +
              "procedure.\"",
            locked: true,
          },
          {
            text:
              "\"I am writing to appeal the denial of my claim and to request a full review of " +
              "the decision under my plan's internal appeals process.\"",
            locked: true,
          },
          {
            text: "\"I am appealing this denial and disagree with the decision that was made.\"",
            locked: false,
          },
          {
            text: "\"This letter is regarding my denied claim, which I am appealing.\"",
            locked: false,
          },
        ],
      },
      {
        label: 'Your Evidence',
        leftOptions: [
          {
            text:
              "\"The denial states 'not medically necessary per plan guidelines.' However, " +
              "Section 4.2 of my policy covers this procedure when ordered by a specialist for this " +
              "diagnosis, which is documented in the attached physician's letter.\"",
            locked: false,
          },
          {
            text:
              "\"The stated reason for denial — lack of medical necessity — is contradicted by the " +
              "attached specialist referral, which explains why this procedure was required.\"",
            locked: false,
          },
          {
            text:
              "\"I don't agree that this wasn't medically necessary. My doctor said I needed it.\"",
            locked: false,
          },
          {
            text: "\"The denial reason doesn't seem right based on what my doctor told me.\"",
            locked: false,
          },
        ],
        rightOptions: [
          {
            text:
              "\"The denial states 'not medically necessary per plan guidelines.' However, " +
              "Section 4.2 of my policy covers this procedure when ordered by a specialist for this " +
              "diagnosis, which is documented in the attached physician's letter.\"",
            locked: true,
          },
          {
            text:
              "\"The stated reason for denial — lack of medical necessity — is contradicted by the " +
              "attached specialist referral, which explains why this procedure was required.\"",
            locked: true,
          },
          {
            text:
              "\"I don't agree that this wasn't medically necessary. My doctor said I needed it.\"",
            locked: false,
          },
          {
            text: "\"The denial reason doesn't seem right based on what my doctor told me.\"",
            locked: false,
          },
        ],
      },
      {
        label: 'Your Reasoning',
        leftOptions: [
          {
            text:
              "\"I request a written determination within the 30-day window required by my plan, " +
              "and I am available to provide any further documentation the reviewer needs.\"",
            locked: false,
          },
          {
            text:
              "\"Please review this appeal promptly and respond in writing with your determination " +
              "and the specific grounds for it.\"",
            locked: false,
          },
          {
            text: "\"I hope this can be looked at again soon. Please let me know what happens.\"",
            locked: false,
          },
          {
            text: "\"Thank you for reconsidering. I look forward to your response.\"",
            locked: false,
          },
        ],
        rightOptions: [
          {
            text:
              "\"I request a written determination within the 30-day window required by my plan, " +
              "and I am available to provide any further documentation the reviewer needs.\"",
            locked: true,
          },
          {
            text:
              "\"Please review this appeal promptly and respond in writing with your determination " +
              "and the specific grounds for it.\"",
            locked: false,
          },
          {
            text: "\"I hope this can be looked at again soon. Please let me know what happens.\"",
            locked: false,
          },
          {
            text: "\"Thank you for reconsidering. I look forward to your response.\"",
            locked: false,
          },
        ],
      },
    ],
  },

  {
    id: 'climaxOutcome',
    type: 'outcome',
    leftResponse:
      "The reviewer's notes: \"Appeal cites specific policy section and includes supporting " +
      "physician documentation. Denial reason directly addressed. Recommend overturning original " +
      "determination.\"",
    rightResponse:
      "The reviewer's notes: \"Appeal does not cite a specific policy provision or new clinical " +
      "documentation beyond what was already reviewed. Original determination stands.\"",
    pauseMs: 2500,
  },

  {
    id: 'closing',
    type: 'closing',
  },
];
