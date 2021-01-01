import { SourceFile, FormatCodeSettings } from 'ts-morph'
import { SemicolonPreference } from 'typescript'

const formatSettings: FormatCodeSettings = {
  indentSize: 2,
  semicolons: SemicolonPreference.Remove,
}

export async function saveSourceFile(sourceFile: SourceFile) {
  // TODO: find a fast way of removing not needed imports
  // sourceFile.organizeImports(formatSettings);
  sourceFile.formatText(formatSettings)
  await sourceFile.save()
}
