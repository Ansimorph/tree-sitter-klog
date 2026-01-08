/**
 * @file Parser for the klog human readable timetracking format
 * @author Björn Ganslandt <hi@ganslandt.xyz>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "klog",

  externals: ($) => [$._newline, $._indent, $._dedent],

  rules: {
    source_file: ($) => repeat($.record),

    _summary_text: ($) => repeat1(choice($._word, $.tag)),
    _word: () => seq(/[^#\s]/, optional(/[^#\s]+/)),
    tag: ($) =>
      seq("#", $.tag_name, optional(seq(token.immediate("="), $.tag_value))),
    tag_name: () => token.immediate(/[\p{L}\d_-]+/u),
    tag_value: () => token.immediate(/(("[^"]*")|('[^']*')|([\p{L}\d_-]*))/u),

    time: ($) =>
      seq(
        optional($.time_association),
        choice($._12hour_time, $._24hour_time),
        optional($.time_association),
      ),
    _12hour_time: () => /(0?[1-9]|1[0-2]):[0-5][0-9](am|pm)/,
    _24hour_time: () => /(24:00|([01]?[0-9]|2[0-3]):[0-5][0-9])/,
    time_association: () => choice("<", ">"),
    open_range: () => /\?+/,
    range: ($) => seq($.time, "-", choice($.time, $.open_range)),

    duration: ($) => choice($.positive_duration, $.negative_duration),
    _duration_string: () => /\d+h\d+m|\d+h|\d+m/,
    positive_duration: ($) => seq(optional("+"), $._duration_string),
    negative_duration: ($) => seq("-", $._duration_string),

    date: ($) => choice($._slash_date, $._dash_date),
    _slash_date: () => /\d{4}\/\d{2}\/\d{2}/,
    _dash_date: () => /\d{4}-\d{2}-\d{2}/,

    record: ($) =>
      seq(
        $._record_header,
        alias(optional(seq($.record_summary)), $.summary),
        optional(seq($._indent, repeat($.entry), $._dedent)),
      ),
    _record_header: ($) =>
      seq($.date, optional(seq(/ +/, $.should_total)), $._newline),
    should_total: ($) => seq("(", $.duration, "!)"),
    record_summary: ($) => repeat1(seq($._summary_text, $._newline)),

    entry: ($) =>
      seq(choice($.duration, $.range), alias($.entry_summary, $.summary)),

    entry_summary: ($) =>
      seq(
        choice($._newline, seq(" ", seq($._entry_summary_inline))),
        optional($._entry_summary_indented),
      ),

    _entry_summary_inline: ($) => seq($._summary_text, $._newline),
    _entry_summary_indented: ($) =>
      seq($._indent, repeat1(seq($._summary_text, $._newline)), $._dedent),
  },
});
