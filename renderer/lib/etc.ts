export function byteCount(str: string | null | undefined) {
  const contents = str;
  let str_character;
  let int_char_count = 0;
  let int_contents_length = contents.length;

  for (let k = 0; k < int_contents_length; k++) {
    str_character = contents.charAt(k);
    if (escape(str_character).length > 4) int_char_count += 2;
    else int_char_count++;
  }

  return int_char_count;
}
