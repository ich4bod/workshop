export const phrases = [
  ['Spanish', 'Hola', 'OH-lah', 'Hello'], ['Spanish', 'Gracias', 'GRAH-see-ahs', 'Thank you'], ['Spanish', 'Por favor', 'por fah-VOR', 'Please'], ['Spanish', '¿Dónde está el baño?', 'DON-deh es-TAH el BAN-yoh', 'Where is the bathroom?'], ['Spanish', '¿Cuánto cuesta?', 'KWAN-toh KWEH-stah', 'How much does it cost?'], ['Spanish', 'No entiendo', 'noh en-TYEN-doh', "I don't understand"], ['Spanish', '¿Habla inglés?', 'AH-blah een-GLAYS', 'Do you speak English?'], ['Spanish', 'La cuenta, por favor', 'lah KWEHN-tah por fah-VOR', 'The bill, please'], ['Spanish', 'Ayuda', 'ah-YOO-dah', 'Help'], ['Spanish', 'Adiós', 'ah-DYOS', 'Goodbye'],
  ['Japanese', 'こんにちは', 'kon-nee-chee-wah', 'Hello'], ['Japanese', 'ありがとう', 'ah-ree-gah-toh', 'Thank you'], ['Japanese', 'お願いします', 'oh-neh-guy-shee-mahs', 'Please'], ['Japanese', 'トイレはどこですか？', 'toy-reh wah doh-koh dess-kah', 'Where is the bathroom?'], ['Japanese', 'いくらですか？', 'ee-koo-rah dess-kah', 'How much does it cost?'], ['Japanese', 'わかりません', 'wah-kah-ree-mah-sen', "I don't understand"], ['Japanese', '英語を話せますか？', 'ay-go oh hah-nah-seh-mahs-kah', 'Do you speak English?'], ['Japanese', 'お会計お願いします', 'oh-kyeh oh-neh-guy-shee-mahs', 'The bill, please'], ['Japanese', '助けて', 'tah-soo-keh-teh', 'Help'], ['Japanese', 'さようなら', 'sah-yoh-nah-rah', 'Goodbye'],
  ['Arabic', 'مرحبا', 'mar-hah-bah', 'Hello'], ['Arabic', 'شكراً', 'shook-rahn', 'Thank you'], ['Arabic', 'من فضلك', 'min fad-lak', 'Please'], ['Arabic', 'أين الحمام؟', 'ayn al-ham-mahm', 'Where is the bathroom?'], ['Arabic', 'بكم هذا؟', 'bee-kam hah-thah', 'How much does it cost?'], ['Arabic', 'لا أفهم', 'lah af-ham', "I don't understand"], ['Arabic', 'هل تتحدث الإنجليزية؟', 'hal tah-tah-dath al-eeng-lee-zee-yah', 'Do you speak English?'], ['Arabic', 'الحساب من فضلك', 'al-hee-sahb min fad-lak', 'The bill, please'], ['Arabic', 'ساعدني', 'sah-eed-nee', 'Help'], ['Arabic', 'مع السلامة', 'mah ah-sah-lah-mah', 'Goodbye']
].map(([language, text, pronunciation, meaning]) => ({ language, text, pronunciation, meaning }));

export function filterPhrases(query = '', language = 'All') {
  const needle = query.trim().toLocaleLowerCase();
  return phrases.filter((phrase) => (language === 'All' || phrase.language === language) && (!needle || [phrase.text, phrase.pronunciation, phrase.meaning].some((value) => value.toLocaleLowerCase().includes(needle))));
}

export function nextLanguage(current, direction) {
  const languages = ['All', 'Spanish', 'Japanese', 'Arabic'];
  return languages[(languages.indexOf(current) + direction + languages.length) % languages.length];
}

export function nextResult(current, direction, count) {
  return Math.max(0, Math.min(count - 1, current + direction));
}
