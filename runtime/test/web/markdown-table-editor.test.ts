import { expect, test } from "bun:test";
import {
  deleteTableColumn,
  deleteTableRow,
  escapeMarkdownTableCell,
  insertTableColumn,
  insertTableRow,
  normalizeTableModel,
  parseMarkdownTableLines,
  parseTableAlignments,
  parseTableCellInlineMarkdown,
  serializeMarkdownTable,
  setTableColumnAlignment,
  splitMarkdownTableRow,
} from "../../extensions/viewers/editor/markdown/table-editor.ts";

test("editable table parser preserves escaped pipes as cell text", () => {
  expect(splitMarkdownTableRow("| Alpha | a\\|b | tail |")).toEqual(["Alpha", "a|b", "tail"]);
});

test("editable table parser detects delimiter alignment", () => {
  expect(parseTableAlignments("| :--- | :---: | ---: |")).toEqual(["left", "center", "right"]);
});

test("editable table parser normalizes uneven rows", () => {
  const model = parseMarkdownTableLines([
    "| Name | Count | Notes |",
    "| --- | ---: | :--- |",
    "| Alpha | 10 | a\\|b |",
    "| Short | only two |",
  ]);

  expect(model).toEqual({
    header: ["Name", "Count", "Notes"],
    alignments: ["left", "right", "left"],
    rows: [
      ["Alpha", "10", "a|b"],
      ["Short", "only two", ""],
    ],
  });
});

test("editable table serializer escapes pipes and normalizes markdown", () => {
  expect(serializeMarkdownTable({
    header: ["Name", "Notes"],
    alignments: ["left", "right"],
    rows: [["Alpha", "a|b"], ["Beta", "multi\nline"]],
  })).toBe([
    "| Name | Notes |",
    "| --- | ---: |",
    "| Alpha | a\\|b |",
    "| Beta | multi line |",
  ].join("\n"));
});

test("editable table normalization pads headers and rows to the widest row", () => {
  expect(normalizeTableModel({
    header: ["A"],
    alignments: ["center"],
    rows: [["1", "2", "3"]],
  })).toEqual({
    header: ["A", "Column 2", "Column 3"],
    alignments: ["center", "left", "left"],
    rows: [["1", "2", "3"]],
  });
});

test("editable table cell escaping is idempotent for plain cells", () => {
  expect(escapeMarkdownTableCell(" plain ")).toBe("plain");
  expect(escapeMarkdownTableCell("a|b")).toBe("a\\|b");
});

test("editable table row mutation preserves width", () => {
  const model = normalizeTableModel({
    header: ["A", "B"],
    alignments: ["left", "right"],
    rows: [["1", "2"], ["3", "4"]],
  });

  expect(insertTableRow(model, 0).rows).toEqual([["1", "2"], ["", ""], ["3", "4"]]);
  expect(deleteTableRow(model, 0).rows).toEqual([["3", "4"]]);
  expect(deleteTableRow({ ...model, rows: [["1", "2"]] }).rows).toEqual([["1", "2"]]);
});

test("editable table column alignment mutation updates delimiter serialization", () => {
  const model = setTableColumnAlignment({
    header: ["A", "B"],
    alignments: ["left", "right"],
    rows: [["1", "2"]],
  }, 0, "center");

  expect(model.alignments).toEqual(["center", "right"]);
  expect(serializeMarkdownTable(model).split("\n")[1]).toBe("| :---: | ---: |");
});

test("editable table large model serializes and parses back without losing shape", () => {
  const model = normalizeTableModel({
    header: Array.from({ length: 12 }, (_, index) => `H${index}`),
    alignments: Array.from({ length: 12 }, (_, index) => index % 3 === 0 ? "center" : index % 3 === 1 ? "right" : "left"),
    rows: Array.from({ length: 250 }, (_, row) => Array.from({ length: 12 }, (_, col) => `r${row}|c${col}`)),
  });

  const serialized = serializeMarkdownTable(model);
  const parsed = parseMarkdownTableLines(serialized.split("\n"));

  expect(parsed?.header).toHaveLength(12);
  expect(parsed?.rows).toHaveLength(250);
  expect(parsed?.rows[249][11]).toBe("r249|c11");
  expect(serialized).toContain("r0\\|c0");
});

test("editable table repeated row and column mutations remain rectangular", () => {
  let model = normalizeTableModel({
    header: ["A", "B", "C"],
    alignments: ["left", "center", "right"],
    rows: [["1", "2", "3"], ["4", "5", "6"]],
  });

  for (let index = 0; index < 25; index++) {
    model = insertTableRow(model, index % model.rows.length);
    model = insertTableColumn(model, index % model.header.length);
  }
  for (let index = 0; index < 10; index++) {
    model = deleteTableRow(model, 0);
    model = deleteTableColumn(model, 0);
  }

  const width = model.header.length;
  expect(width).toBeGreaterThan(1);
  expect(model.rows.every((row) => row.length === width)).toBe(true);
  expect(model.alignments).toHaveLength(width);
});

test("editable table cell inline parser decorates markdown while preserving raw delimiters", () => {
  expect(parseTableCellInlineMarkdown("**bold** _em_ ~~gone~~ `code` [link](https://example.com)")).toEqual([
    { type: "strong", delimiter: "**", children: [{ type: "text", text: "bold" }] },
    { type: "text", text: " " },
    { type: "emphasis", delimiter: "_", children: [{ type: "text", text: "em" }] },
    { type: "text", text: " " },
    { type: "strike", children: [{ type: "text", text: "gone" }] },
    { type: "text", text: " " },
    { type: "code", text: "code" },
    { type: "text", text: " " },
    { type: "link", children: [{ type: "text", text: "link" }], url: "https://example.com" },
  ]);
});

test("editable table cell inline parser handles entities, autolinks, images, and nested marks", () => {
  expect(parseTableCellInlineMarkdown("&amp; &#169; &#x1f642; <https://example.com> ![alt](https://example.com/i.png) **bold _em_**")).toEqual([
    { type: "entity", raw: "&amp;", text: "&" },
    { type: "text", text: " " },
    { type: "entity", raw: "&#169;", text: "©" },
    { type: "text", text: " " },
    { type: "entity", raw: "&#x1f642;", text: "🙂" },
    { type: "text", text: " " },
    { type: "link", children: [{ type: "text", text: "https://example.com" }], url: "https://example.com", raw: "<https://example.com>", autolink: true },
    { type: "text", text: " " },
    { type: "image", raw: "![alt](https://example.com/i.png)", alt: "alt", url: "https://example.com/i.png" },
    { type: "text", text: " " },
    { type: "strong", delimiter: "**", children: [
      { type: "text", text: "bold " },
      { type: "emphasis", delimiter: "_", children: [{ type: "text", text: "em" }] },
    ] },
  ]);
});

test("editable table cell inline parser leaves invalid or ambiguous markdown as text", () => {
  expect(parseTableCellInlineMarkdown("snake_case &unknown; <ftp://example.com> ![bad](javascript:alert(1))")).toEqual([
    { type: "text", text: "snake_case &unknown; <ftp://example.com> " },
    { type: "image", raw: "![bad](javascript:alert(1)", alt: "bad", url: "javascript:alert(1" },
    { type: "text", text: ")" },
  ]);
  expect(parseTableCellInlineMarkdown("**unclosed [nope]( )")).toEqual([
    { type: "text", text: "**unclosed [nope]( )" },
  ]);
});

test("editable table cell inline parser handles combined bold-italic emphasis", () => {
  expect(parseTableCellInlineMarkdown("***both*** ___also___")).toEqual([
    { type: "strong", delimiter: "**", children: [{ type: "emphasis", delimiter: "*", children: [{ type: "text", text: "both" }] }] },
    { type: "text", text: " " },
    { type: "strong", delimiter: "__", children: [{ type: "emphasis", delimiter: "_", children: [{ type: "text", text: "also" }] }] },
  ]);
});

test("editable table cell inline parser preserves nested link and mark shape", () => {
  expect(parseTableCellInlineMarkdown("__[strong link](https://example.com)__ and *soft [em](mailto:a@example.com)*")).toEqual([
    { type: "strong", delimiter: "__", children: [{ type: "link", children: [{ type: "text", text: "strong link" }], url: "https://example.com" }] },
    { type: "text", text: " and " },
    { type: "emphasis", delimiter: "*", children: [
      { type: "text", text: "soft " },
      { type: "link", children: [{ type: "text", text: "em" }], url: "mailto:a@example.com" },
    ] },
  ]);
});

test("editable table column mutation preserves alignment and rows", () => {
  const model = normalizeTableModel({
    header: ["A", "B"],
    alignments: ["left", "right"],
    rows: [["1", "2"]],
  });

  expect(insertTableColumn(model, 0)).toEqual({
    header: ["A", "Column 2", "B"],
    alignments: ["left", "left", "right"],
    rows: [["1", "", "2"]],
  });
  expect(deleteTableColumn(model, 0)).toEqual({
    header: ["B"],
    alignments: ["right"],
    rows: [["2"]],
  });
  expect(deleteTableColumn({ header: ["A"], alignments: ["center"], rows: [["1"]] })).toEqual({
    header: ["A"],
    alignments: ["center"],
    rows: [["1"]],
  });
});
