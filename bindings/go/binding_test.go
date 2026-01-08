package tree_sitter_klog_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_klog "github.com/ansimorph/tree-sitter-klog/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_klog.Language())
	if language == nil {
		t.Errorf("Error loading Klog grammar")
	}
}
