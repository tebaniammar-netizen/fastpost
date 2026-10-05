import JSZip from 'jszip';

export interface FileToZip {
  path: string;
  content: string;
}

export async function downloadAndroidProjectZip(files: FileToZip[]): Promise<void> {
  const zip = new JSZip();

  for (const file of files) {
    // Normalise le chemin (enlève leading slash si présent)
    const cleanPath = file.path.startsWith('/') ? file.path.slice(1) : file.path;
    zip.file(cleanPath, file.content);
  }

  // Génération du blob ZIP
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  // Déclenchement automatique du téléchargement
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `fastfood-pos-android-project-${new Date().toISOString().slice(0, 10)}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
