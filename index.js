const fs = require('fs');
const { Configuration , OpenAIApi }= require('openai');

const config = new Configuration({
   apiKey: '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'
});

const openai = new OpenAIApi(config);

const runPrompt = async (peticion) => {
  const prompt = `Que categoria le darias (para facil categorizacion) y cual es el tema de la siguiente peticion ciudadana en cuatro palabras, tambien identifica si el mensaje tiene una ubicacion, coordenadas, o direccion. La respuesta que sea un JSON con los parametros categoria, tema, y ubicacion: "${peticion}"`;
  //const prompt = `Encuentra la categoria, tema, y ubicacion de la siguiente peticion ciudadana (dame la respuesta en JSON con los parametros categoria, tema y ubicacion): "${peticion}"`
  //const prompt = `Analiza la siguiente peticion ciudadana dame la respuesta en formato JSON con los parametros categoria, tema, y ubicacion: "${peticion}"`

  const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 2048,
      temperature: .4,
  });


  const tema = response.data.choices[0].text;
  console.log(tema)
  return tema;
  
}


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
        const response = await runPrompt(content)

        if (response) {
          // Obtener el string de respuesta del API
          const apiResponseString = response;

          // Guardar el string en un nuevo archivo en la carpeta de salida
          const outputFilename = `response_${filename}`;
          fs.writeFileSync(`${outputFolder}/${outputFilename}`, apiResponseString);

          console.log(`Respuesta guardada en '${outputFilename}'`);
        } else {
          console.log(`Fallo en la llamada al API para el archivo`);
        }
      } catch (error) {
        console.log(`Error en la llamada al API para el archivo '${filename}': ${error}`);
      }
    }
  }
}

// Ejemplo de uso
const inputFolderPath = 'input';
const outputFolderPath = 'result';

callApiAndSaveResponses(inputFolderPath, outputFolderPath);
