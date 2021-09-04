import { SourceFile, FormatCodeSettings, ts } from 'ts-morph'

const formatSettings: FormatCodeSettings = {
  indentSize: 2,
  semicolons: ts.SemicolonPreference.Remove,
}

export async function saveSourceFile(sourceFile: SourceFile) {
  sourceFile.formatText(formatSettings)
  await sourceFile.save()
}
