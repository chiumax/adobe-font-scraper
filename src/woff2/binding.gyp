{
  "targets": [
    {
      "target_name": "woff2_encode",
      "sources": [
        "./woff2/src/font.cc",
        "./woff2/src/glyph.cc",
        "./woff2/src/normalize.cc",
        "./woff2/src/table_tags.cc",
        "./woff2/src/transform.cc",
        "./woff2/src/variable_length.cc",
        "./woff2/src/woff2_common.cc",
        "./woff2/src/woff2_dec.cc",
        "./woff2/src/woff2_enc.cc",
        "./woff2/src/woff2_info.cc",
        "./woff2/src/woff2_out.cc",
        "./woff2/brotli/c/common/dictionary.c",
        "./woff2/brotli/c/dec/bit_reader.c",
        "./woff2/brotli/c/dec/decode.c",
        "./woff2/brotli/c/dec/huffman.c",
        "./woff2/brotli/c/dec/state.c",
        "./woff2/brotli/c/enc/backward_references.c",
        "./woff2/brotli/c/enc/backward_references_hq.c",
        "./woff2/brotli/c/enc/bit_cost.c",
        "./woff2/brotli/c/enc/block_splitter.c",
        "./woff2/brotli/c/enc/brotli_bit_stream.c",
        "./woff2/brotli/c/enc/cluster.c",
        "./woff2/brotli/c/enc/compress_fragment.c",
        "./woff2/brotli/c/enc/compress_fragment_two_pass.c",
        "./woff2/brotli/c/enc/dictionary_hash.c",
        "./woff2/brotli/c/enc/encode.c",
        "./woff2/brotli/c/enc/entropy_encode.c",
        "./woff2/brotli/c/enc/histogram.c",
        "./woff2/brotli/c/enc/literal_cost.c",
        "./woff2/brotli/c/enc/memory.c",
        "./woff2/brotli/c/enc/metablock.c",
        "./woff2/brotli/c/enc/static_dict.c",
        "./woff2/brotli/c/enc/utf8_util.c",
        "./src/woff2_encode.cc"
      ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")",
        "./woff2/brotli/c/include",
        "./woff2/include"
      ],
      "cflags": ["-std=c++11 -w"],
      "conditions": [
        [
          "OS!=\"win\"",
          {
            "cflags+": ["-std=c++11"],
            "cflags_c+": ["-std=c++11"],
            "cflags_cc+": ["-std=c++11"]
          }
        ],
        [
          "OS==\"mac\"",
          {
            "xcode_settings": {
              "OTHER_CPLUSPLUSFLAGS": ["-std=c++11", "-stdlib=libc++", "-w"],
              "OTHER_LDFLAGS": ["-stdlib=libc++"],
              "MACOSX_DEPLOYMENT_TARGET": "10.7"
            }
          }
        ]
      ]
    },
    {
      "target_name": "woff2_decode",
      "sources": [
        "./woff2/src/font.cc",
        "./woff2/src/glyph.cc",
        "./woff2/src/normalize.cc",
        "./woff2/src/table_tags.cc",
        "./woff2/src/transform.cc",
        "./woff2/src/variable_length.cc",
        "./woff2/src/woff2_common.cc",
        "./woff2/src/woff2_dec.cc",
        "./woff2/src/woff2_enc.cc",
        "./woff2/src/woff2_info.cc",
        "./woff2/src/woff2_out.cc",
        "./woff2/brotli/c/common/dictionary.c",
        "./woff2/brotli/c/dec/bit_reader.c",
        "./woff2/brotli/c/dec/decode.c",
        "./woff2/brotli/c/dec/huffman.c",
        "./woff2/brotli/c/dec/state.c",
        "./woff2/brotli/c/enc/backward_references.c",
        "./woff2/brotli/c/enc/backward_references_hq.c",
        "./woff2/brotli/c/enc/bit_cost.c",
        "./woff2/brotli/c/enc/block_splitter.c",
        "./woff2/brotli/c/enc/brotli_bit_stream.c",
        "./woff2/brotli/c/enc/cluster.c",
        "./woff2/brotli/c/enc/compress_fragment.c",
        "./woff2/brotli/c/enc/compress_fragment_two_pass.c",
        "./woff2/brotli/c/enc/dictionary_hash.c",
        "./woff2/brotli/c/enc/encode.c",
        "./woff2/brotli/c/enc/entropy_encode.c",
        "./woff2/brotli/c/enc/histogram.c",
        "./woff2/brotli/c/enc/literal_cost.c",
        "./woff2/brotli/c/enc/memory.c",
        "./woff2/brotli/c/enc/metablock.c",
        "./woff2/brotli/c/enc/static_dict.c",
        "./woff2/brotli/c/enc/utf8_util.c",
        "./src/woff2_decode.cc"
      ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")",
        "./woff2/brotli/c/include",
        "./woff2/include"
      ],
      "cflags": ["-std=c++11 -w"],
      "conditions": [
        [
          "OS!=\"win\"",
          {
            "cflags+": ["-std=c++11"],
            "cflags_c+": ["-std=c++11"],
            "cflags_cc+": ["-std=c++11"]
          }
        ],
        [
          "OS==\"mac\"",
          {
            "xcode_settings": {
              "OTHER_CPLUSPLUSFLAGS": ["-std=c++11", "-stdlib=libc++", "-w"],
              "OTHER_LDFLAGS": ["-stdlib=libc++"],
              "MACOSX_DEPLOYMENT_TARGET": "10.7"
            }
          }
        ]
      ]
    }
  ]
}
