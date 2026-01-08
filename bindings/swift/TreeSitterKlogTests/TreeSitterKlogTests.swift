import XCTest
import SwiftTreeSitter
import TreeSitterKlog

final class TreeSitterKlogTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_klog())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Klog grammar")
    }
}
