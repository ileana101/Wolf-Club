# Findings Report Template

**Use it:** during tonight's synthesis studio, and again as the write-up you hand your client **Inputs:** your capture sheets, your participant sheets, your placemat, your job card **Fill in:** everything in `[brackets]`. Delete the guidance text as you go.

This is the shape a real usability report takes, trimmed for a two-unit class. The first four sections are the report; the two appendices are short by design. Section 4 carries the most weight, because it is where your research turns into a scope you can actually build in three weeks.

One note before you start: an AI can draft most of sections 2 and 3 from your raw sheets in a few minutes. Let it. What it cannot do is decide your scope in section 4, and that section is where the credit lives.

---

## 1\. Background

The Wolf Club website was created as a centralized hub containing guiding text for the members of the Wolf Club ARPG after DeviantArt's UI had changed. While the website has assisted in making information easier to access without having to search throughout all of DeviantArt, a few staff members, current members, and their perspectives started to express confusion where essential information was living, especially regarding character creation. The moderators within the staff team assist with the upkeep of the website, ensuring that the sources match up with the sources that live on DeviantArt as much as possible. Approach A links directly to the DeviantArt source \[[https://wolf-club-eta.vercel.app/deviantart-style/index.html](https://wolf-club-eta.vercel.app/deviantart-style/index.html)\]. Approach B links directly to the staff created website \[[https://wolf-club-eta.vercel.app/weebly-style/joining.html](https://wolf-club-eta.vercel.app/weebly-style/joining.html)\]. There were three participants who weighed in their input throughout August 7th through August 10th.

---

## 2\. Executive summary

The numbers and then the decision.

### The score

For each task and version, the score is the share of participants who rated it 4 or 5\. Count the 4s and 5s, divide by how many people you asked. This is a satisfaction score, not an average rating.

| Task | A · satisfaction | A · ease of use | B · satisfaction | B · ease of use | Better on |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Task 1: Access application guide | 2 of 3 · 67% | 1 of 3 · 33% | 3 of 3 · 100% | 3 of 3 · 100% | B |
| Task 2: Find info on fan-based characters | 0 of 3 · 0% | 0 of 3 · 0% | 1 of 3 · 33% | 2 of 3 · 67% | B |
| Task 3: Character biography requirements | 3 of 3 · 100% | 3 of 3 · 100% | 3 of 3 · 100% | 3 of 3 · 100% | Tie |
| **The job, all tasks (Nav/search: Tasks 1–2)** | **2 of 6 · 33%** | **1 of 6 · 17%** | **4 of 6 · 67%** | **5 of 6 · 83%** | **B** |

*Note: Tasks 1 and 2 both test the same placemat job — finding existing written rules/info on the site — so I rolled them together for the job-level row. Task 3 (character biography requirements) scored a clean 100%/100% on both versions for all three participants, so I've treated it as a separate, already-solid job rather than folding it into the critical job's score — see the colors table below.*

### The colors

| Job on your placemat | Color | Why |
| :---- | :---- | :---- |
| Navigation/search (finding rules & character info) · A | Red | 33% satisfaction, 17% ease. Misty searched unaided for 48 minutes and never found a rule that already exists on the page; Frankie also nearly abandoned the application guide ("This page is really long…"). |
| Navigation/search (finding rules & character info) · B | Yellow | Ease climbed to 83%, but satisfaction landed at 67% — under the 80% line. Held back almost entirely by Task 2, where all three participants hit the same wall: no search function. |
| Character biography requirements (Task 3\) · A and B | Green | 100% on both questions, both versions, all three participants. Not a differentiator this round — treat as confirmed-working, not as evidence for the build. |
| Everything you did not test | Gray | Not tested this round |

### The call, in one sentence

We're building B, the admin-made website, because it scored 67%/83% on the navigation/search job against A's 33%/17%, and the reason people gave was that information lives in one consolidated source instead of being scattered across DeviantArt — though B still isn't green, because all three participants hit the same missing-search-function wall on Task 2\.

---

## 3\. Highlights and lowlights

Three to five entries total. A larger project would present more, but three is a good number here. Mark each one (+) or (-), and give every entry a quote in the participant's words. If you cannot quote anyone, you have a number, not a finding, and it does not belong in this section.

**Highlights**

**(+) Finding the application guide, approach B:** Nicholas's first click landed on the Wolf Club homepage and he completed the task in 5 minutes, versus 10 minutes on A. Ease of use hit 100% (5/5/5) across all three participants on B, versus 33% on A. "Really seamless."

**(+) Consolidated source, approach B:** Both Frankie and Misty independently named the same reason they'd reach for B on a busy day — everything lives in one place instead of being spread across DeviantArt. "If I were finding myself busy, I would prefer to use the website because the information has been consolidated within a singular source as opposed to being spread apart through multiple sources like on Deviantart."

**Lowlights**

**(-) Finding the "inspired, not based on" rule, approach A:** Misty searched independently for 48 minutes and never found a rule that does exist on the page — she'd been searching on synonyms rather than the site's exact wording, and only found it afterward via side-by-side rescue screenshots. "Where is this rule? I know I've read it somewhere but I am not seeing it for the life of me\!" Frankie nearly gave up on the same page for a related reason: "This page is really long…"

**(-) No search function, both versions:** All three participants named the same missing piece on both A and B, and it's where Task 2 collapsed — 0% ease of use on A, only 67% on B. Frankie: "The website is easier to use, but I am confused why there are more sources to scan through." Misty and Frankie both described the same pattern in their own words: "Information is spread through multiple sources, making it hard to scan through quickly."

**(-) Wording mismatch between DeviantArt and the site:** Misty's session surfaced that the rule is phrased differently on each source — "Why are these sources merged on deviantart but not on the website? That is so confusing\!" This is a wording/consistency problem between the two sources, not just a navigation problem, and it likely compounds whichever version gets built.

---

## 4\. Next steps: a scope your research supports

This is the section that decides your next three weeks. Be specific enough that someone else could pick up your project on Monday and know what to do because that situation can happen “in the wild.” The test for every line here is simple: what in the research supports this?

### 4.1 The decision

Written as KEPT / OVER / BECAUSE, the same format you use in the decision log.

- **KEPT:** B hybrid \- Language updates need to occur.  
- **OVER:** A, especially due to the desire of the consolidation of sources  
- **BECAUSE:** B scored 83% on ease of use for the navigation/search job against A's 17%. Misty spent 48 minutes searching independently on A for a rule that already existed on the page, and only found it after assistance. "Where is this rule? I know I've read it somewhere but I am not seeing it for the life of me\!" 

### 4.2 In scope

Stack ranked, and tied to your flow map. Each line is what you plan to build, the P1 task it serves, and the evidence that puts it on the list.

| Order | What you're building | Serves which P1 task | What supports it |
| :---- | :---- | :---- | :---- |
| 1 | \[A search function on the site\] | \[Task 2: Find info on fan-based characters\] | \[0% ease of use on A, only 67% on B\] |
| 2 | \[Reconcile wording between the site and the DeviantArt source\] | \[Task 1: Access application guide\] | \[Misty's 48-minute failed search for a rule that already existed: "Why are these sources merged on deviantart but not on the website? That is so confusing\!"\] |
| 3 | \[Shorten/restructure the application guide page \] | \[Task 1: Access application guide\] | \[Frankie almost abandoned the page: "This page is really long…"as well as the hesitation for 2 minutes before continuing\] |

### 4.3 Out of scope

Everything you are choosing not to build. This is the section that keeps you from hitting your deadline. This is optional, but out of scope can be stack ranked as well so the client can see what is on deck for the future. Sometimes “what would change my mind” will be removing something from in-scope.

| Not building | Why not | What would change my mind |
| :---- | :---- | :---- |
| \[AI chatbot for rule lookup\] | \[Bigger build than 3 weeks supports, and it depends on \#2 (wording reconciliation) being done first — a chatbot pulling from two sources that disagree would just answer confidently wrong \] | \[If members and prospective members alike request for that need explicitly to be within the website.\] |
| \[Any changes to character biography requirements\] | \[Task 3 scored 100%/100% on both versions for everyone. This job is already green, so there's no evidence calling for a change \] | \[If a future round with different participants surfaces a gap here\] |

### 4.4 What's still uncertain

For each open question, name what specifically you don't know and how it gets settled. "More research" is an incomplete answer. Do your best to specifically call out the conversation, the task, or the build that resolves it. By when it critical since it puts a deadline on when you can realistically build and test something.

| Open question | How it gets settled | By when |
| :---- | :---- | :---- |
| \[Does a search function alone fix Task 2, or is the deeper problem information architecture (how sources are organized, not just findable)?\] | \[Build a low-fidelity search prototype and re-test Task 2 with 3–5 participants\] | \[End of build week 1, before committing further developming time to it\] |
| \[Open question	How it gets settled	By when Does a search function alone fix Task 2, or is the deeper problem information architecture (how sources are organized, not just findable)?	Build a low-fidelity search prototype and re-test Task 2 with 2–3 participants	End of build week 1, before committing further dev time to it How many rules actually have wording mismatches between DeviantArt and the site\] | \[Audit both sources side by side, rule by rule, and log every mismatch found \] | \[Before starting the reconciliation build in week 2\] |

### 4.5 What you need from your client

**What I’m going to show them:** The navigation/search contrast (B at 67%/83% vs. A at 33%/17%), Misty's 48-minute failed search, and the wording-mismatch quote. The three pieces that make the B decision self-evident.

**What I’m going to ask:** Whether the 4.2 plan of search function and wording reconciliation first, source consolidation and polish held back, makes sense given a 3-person sample, and whether the wording mismatch Misty hit is one they recognize more broadly.

**What I’m need a decision on:** Whether to reserve time later this cycle for the chatbot idea, or table it entirely until a future round.

---

## Appendix A. How the score works

Keep this short; it's the same for everyone. Adjust it only if you changed something.

Two questions, asked per task, per version, right after the participant attempts the task:

- **Satisfaction:** 1 far below expectations, 5 exceptional, sets a new standard  
- **Ease of use:** 1 very difficult, 5 very easy

The score for each is the percentage of participants who answered 4 or 5\. Four people out of five rating ease of use 4 or higher means ease of use is 80%. We count top ratings rather than averaging, because an average lets one person who could not do the job get cancelled out by someone who found it easy.

A job's score is its tasks' scores taken together. If one task drags the job down, name that task in section 4; that task is usually where your build week starts.

| Band | Score | Meaning |
| :---- | :---- | :---- |
| Green | 80% or more | Meets or exceeds. The job gets done well. |
| Yellow | 50 to 79% | Partially meets. It works for some people, not for everyone. |
| Red | under 50% | Below. The job isn't getting done. |
| Gray | no data | Not tested this round. |

---

## Appendix B. Participants and method

**Participants:** Three members of the Wolf Club ARPG — one admin (a few months in the role) and two others familiar enough with the site to count as real users of this job. All three had prior exposure to both DeviantArt and the admin-made website before the session.

**Method:** Sessions ran August 7–10, 2026, each participant attempting the same tasks on both versions. Start order was alternated — two participants (Nicholas, Frankie) started on B, one (Misty) started on A — to control for order effects. Devices varied by participant (laptop, laptop, phone), so nothing here should be read as a device-specific finding. One session (Misty) ran long — about 48 minutes of independent searching on Task 1 before a rescue was given — which is unusually long compared to the other two sessions and is called out directly in section 3 rather than averaged in quietly.

**Tasks used:**

1. Find where the site states new characters can only be inspired by, not based on, existing media.  
2. Find information about fan-created characters.  
3. Find the character biography requirements.

A few notes on gaps, so you can decide whether to fill them before submitting:

* Exact session lengths (beyond Misty's 48-minute search) weren't captured on the "Date and length" line for Nicholas or Frankie — worth adding if you have them.  
* "Remote or in person" wasn't stated on any of the three sheets — I left it implied by device variety, but you may want to state it explicitly if you know it.