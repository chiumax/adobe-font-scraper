// #include <string>
#include <nan.h>
// #include <node.h>
// #include <node_buffer.h>
#include <stdlib.h>
#include <woff2/decode.h>

using namespace v8;

NAN_METHOD(decode) {
  Local<Object> input_buffer = info[0]->ToObject();

  if (!node::Buffer::HasInstance(input_buffer)) {
    Nan::ThrowError(Nan::TypeError("First argument should be a Buffer."));
    return;
  }

  size_t input_length = node::Buffer::Length(input_buffer);
  char* input_data = node::Buffer::Data(input_buffer);

  size_t output_length = woff2::ComputeWOFF2FinalSize(
      reinterpret_cast<const uint8_t*>(input_data), input_length);

  char* output_data = reinterpret_cast<char*>(calloc(output_length, 1));

  if (!woff2::ConvertWOFF2ToTTF(
          reinterpret_cast<uint8_t*>(output_data), output_length,
          reinterpret_cast<const uint8_t*>(input_data), input_length)) {
    Nan::ThrowError(Nan::Error("Could not convert the given font."));
    free(output_data);
    return;
  }

  Nan::MaybeLocal<v8::Object> outputBuffer =
      Nan::NewBuffer(reinterpret_cast<char*>(
          realloc(output_data, output_length)), output_length);

  info.GetReturnValue().Set(outputBuffer.ToLocalChecked());
}

NAN_MODULE_INIT(Init) {
  Nan::Set(target, Nan::New("decode").ToLocalChecked(),
           Nan::GetFunction(
               Nan::New<FunctionTemplate>(decode)).ToLocalChecked());
}

NODE_MODULE(woff2_decode, Init)
