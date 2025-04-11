package main

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestIsCamelCase(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected bool
	}{
		{
			name:     "正しいキャメルケース",
			input:    "MyComponent",
			expected: true,
		},
		{
			name:     "ケバブケース",
			input:    "my-component",
			expected: false,
		},
		{
			name:     "小文字始まり",
			input:    "myComponent",
			expected: false,
		},
		{
			name:     "先頭だけが大文字（Header）",
			input:    "Header",
			expected: true,
		},
		{
			name:     "先頭だけが大文字（Index）",
			input:    "Index",
			expected: true,
		},
		{
			name:     "先頭だけが大文字（Footer）",
			input:    "Footer",
			expected: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := isCamelCase(tt.input)
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestIsKebabCase(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected bool
	}{
		{
			name:     "正しいケバブケース",
			input:    "my-component",
			expected: true,
		},
		{
			name:     "キャメルケース",
			input:    "MyComponent",
			expected: false,
		},
		{
			name:     "大文字を含む",
			input:    "my-Component",
			expected: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := isKebabCase(tt.input)
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestConvertCamelToKebab(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{
			name:     "基本的な変換",
			input:    "MyComponent",
			expected: "my-component",
		},
		{
			name:     "複数の大文字",
			input:    "MyReactComponent",
			expected: "my-react-component",
		},
		{
			name:     "連続する大文字",
			input:    "MyUIComponent",
			expected: "my-ui-component",
		},
		{
			name:     "先頭だけが大文字（Header）",
			input:    "Header",
			expected: "header",
		},
		{
			name:     "先頭だけが大文字（Index）",
			input:    "Index",
			expected: "index",
		},
		{
			name:     "先頭だけが大文字（Footer）",
			input:    "Footer",
			expected: "footer",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := camelToKebab(tt.input)
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestConvertKebabToCamel(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{
			name:     "基本的な変換",
			input:    "my-component",
			expected: "MyComponent",
		},
		{
			name:     "複数のハイフン",
			input:    "my-react-component",
			expected: "MyReactComponent",
		},
		{
			name:     "連続するハイフン",
			input:    "my--component",
			expected: "MyComponent",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := kebabToCamel(tt.input)
			assert.Equal(t, tt.expected, result)
		})
	}
} 