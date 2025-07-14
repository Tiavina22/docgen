
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { generateDocWithGemini } from './geminiService';

export function activate(context: vscode.ExtensionContext) {
  // Commande : Générer la doc pour le code sélectionné
  context.subscriptions.push(
	vscode.commands.registerCommand('docgen.generateDoc', async () => {
	  const editor = vscode.window.activeTextEditor;
	  if (!editor) {
		vscode.window.showWarningMessage('Aucun éditeur actif.');
		return;
	  }
	  const code = editor.document.getText(editor.selection);
	  if (!code) {
		vscode.window.showWarningMessage('Sélectionnez le code d’une route ou d’un contrôleur à documenter.');
		return;
	  }
	  const apiKey = vscode.workspace.getConfiguration('docgen').get<string>('geminiApiKey');
	  if (!apiKey) {
		vscode.window.showErrorMessage('Configurez votre clé API Gemini dans les paramètres de l’extension.');
		return;
	  }
	  try {
		const doc = await generateDocWithGemini(code, apiKey);
		// Nom de fichier basé sur la date/heure
		const now = new Date();
		const fileName = `doc_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}${now.getSeconds().toString().padStart(2,'0')}.md`;
		const wsFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
		if (!wsFolder) {
		  vscode.window.showErrorMessage('Aucun dossier ouvert dans VS Code.');
		  return;
		}
		const docsDir = path.join(wsFolder, 'docs');
		if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir);
		const filePath = path.join(docsDir, fileName);
		fs.writeFileSync(filePath, doc, 'utf8');
		const docUri = vscode.Uri.file(filePath);
		vscode.window.showInformationMessage(`Documentation générée : ${fileName}`);
		vscode.window.showTextDocument(docUri);
	  } catch (e: any) {
		vscode.window.showErrorMessage(e.message || 'Erreur lors de la génération de la documentation.');
	  }
	})
  );

  // Commande : Générer la doc globale
  context.subscriptions.push(
	vscode.commands.registerCommand('docgen.generateAllDocs', async () => {
	  const apiKey = vscode.workspace.getConfiguration('docgen').get<string>('geminiApiKey');
	  if (!apiKey) {
		vscode.window.showErrorMessage('Configurez votre clé API Gemini dans les paramètres de l’extension.');
		return;
	  }
	  // Détection automatique des routes/controllers et appel à Gemini à implémenter ici
	  vscode.window.showInformationMessage('Génération de la documentation globale IA (Gemini) à venir…');
	})
  );
}

export function deactivate() {}
