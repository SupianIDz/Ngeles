# Contributing to Ngeles 🤝

Thank you for your interest in contributing to Ngeles! Whether you are a programmer looking to improve the codebase, or a creative writer wanting to add hilarious excuses, everyone is welcome.

## 📝 How to Add or Create Excuses

Ngeles uses a **Data-Driven Architecture**, meaning you can add new excuses, contexts (scenarios), or entirely new languages **without writing any JavaScript/TypeScript code**.

### 1. Adding Excuses to Existing Languages
To add a new excuse to an existing topic (e.g., `work` in English):
1. Open the data file: `data/en/work.json`
2. You will see a `levels` object containing arrays for `"normal"`, `"ridiculous"`, and `"realityBending"`.
3. Add your new string to the desired array. 
   - **Tip 1:** You can use `[TARGET]` as a placeholder (e.g., `"Sorry [TARGET], I was abducted by aliens."`). The system will automatically replace it with the target's name or a fallback.
   - **Tip 2:** You can use `[NAME]` as a placeholder for the user's name (e.g., `"Tell them [NAME] is sick today."`). It will be replaced by the generator's name (or a fallback like "saya" / "I").

### 2. Creating a New Scenario / Topic
Want to add a new category like "School" or "Dates"?
1. Update `data/manifest.json`. Add your new topic to the `topics` array inside your specific language:
   ```json
   {
     "languages": [
       {
         "id": "en",
         "label": "English",
         "topics": [
           { "id": "work", "icon": "fa-solid fa-briefcase" },
           { "id": "school", "icon": "fa-solid fa-school" }
         ]
       }
     ]
   }
   ```
2. Create a JSON file for the new topic in your specific language folder (e.g., `data/en/school.json`).
3. Fill the JSON file with the standard level structure:
   ```json
   {
     "levels": {
       "normal": [],
       "ridiculous": [],
       "realityBending": []
     }
   }
   ```

### 3. Adding a Whole New Language
To translate Ngeles to a new language (e.g., Spanish `es`):
1. Update `data/manifest.json` and add your language to the `languages` array:
   ```json
   { "id": "es", "label": "Español" }
   ```
2. Translate the UI interface: Create `src/locales/es.json` by copying `src/locales/en.json` and translating its values.
3. Update `src/lib/i18n.ts` to import and export your new UI JSON.
4. Finally, create a `data/es/` folder and translate all the excuse JSON files (e.g., `work.json`, `family.json`, `social.json`).

---

## 💻 Developer Guidelines

If you are contributing to the source code (Svelte, TypeScript, or Backend), please adhere to the following rules:

### 1. Code Style (`oxfmt`)
We enforce strict code formatting. All JavaScript, TypeScript, Svelte, and CSS files **must** be formatted using `oxlint`/`oxfmt`. **Do not use Prettier.**

Before creating a Pull Request, make sure you format your code:
*(Assuming you have your formatter configured in the project or globally)*
Please ensure your code is clean, concise, and uses Bun for package management.

### 2. Conventional Commits
All commit messages **must** follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

**Format:**
`<type>[optional scope]: <description>`

**Examples:**
- `feat: add new school scenario`
- `fix: correct typo in reality bending excuse`
- `refactor: extract UI translation logic`
- `docs: update readme with setup instructions`

Pull Requests with messy commit histories or non-conventional commits may be rejected or asked to be rebased.

---

**Ready to start?** Fork the repo, create a branch, make your awesome changes, and submit a PR! We can't wait to see your excuses.
