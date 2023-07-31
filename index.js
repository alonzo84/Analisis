const fs = require('fs');
const { Configuration , OpenAIApi }= require('openai');

const config = new Configuration({
   apiKey: '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'
});

const openai = new OpenAIApi(config);


async function callApiAndSaveResponses(inputFolder, outputFolder) {
  // Verificar si la carpeta de entrada existe
  if (!fs.existsSync(inputFolder)) {
    console.log(`La carpeta de entrada '${inputFolder}' no existe.`);
    return;
  }

  // Crear la carpeta de salida si no existe
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
    console.log(`La carpeta de salida '${outputFolder}' ha sido creada.`);
  }

  // Leer los nombres de archivos en la carpeta de entrada
  const files = fs.readdirSync(inputFolder);

  for (const filename of files) {
    if (filename.endsWith('.txt')) {
      // Leer el contenido del archivo de texto
      const content = fs.readFileSync(`${inputFolder}/${filename}`, 'utf8');

      try {
        // Realizar la llamada al API
        const response = await axios.post(apiEndpoint, { text: content });

        if (response.status === 200) {
          // Obtener el string de respuesta del API
          const apiResponseString = response.data;

          // Guardar el string en un nuevo archivo en la carpeta de salida
          const outputFilename = `response_${filename}`;
          fs.writeFileSync(`${outputFolder}/${outputFilename}`, apiResponseString);

          console.log(`Respuesta guardada en '${outputFilename}'`);
        } else {
          console.log(`Fallo en la llamada al API para el archivo '${filename}'. Status code: ${response.status}`);
        }
      } catch (error) {
        console.log(`Error en la llamada al API para el archivo '${filename}': ${error.message}`);
      }
    }
  }
}

// Ejemplo de uso
const inputFolderPath = 'input';
const outputFolderPath = 'result';

callApiAndSaveResponses(inputFolderPath, outputFolderPath);
