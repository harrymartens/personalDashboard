import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import tailwind from "eslint-plugin-tailwindcss";
import js from "@eslint/js";
import ts from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  js.configs.recommended,
  ...ts.configs.recommended,
  ...tailwind.configs["flat/recommended"],
  {
    rules: {
        "no-unused-vars": "warn",
        "react/react-in-jsx-scope": "off",
        "react/jsx-uses-react": "off"
    }
  },
  {
    "settings": {
      "react": {
        "version": "detect"
      }
    }
  },
];