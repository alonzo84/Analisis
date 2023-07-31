const { Configuration , OpenAIApi }= require('openai');


const config = new Configuration({
   apiKey: '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'
});


const openai = new OpenAIApi(config);

const peticion = "Me gustaría proponer un plebiscito para el proyecto del tren elevado sky train baja de San Ysidro a Rosarito; Esto porque creo que no hay transparencia y la ciudadanía no tiene la participación que se merece en la toma de decisiones que afectan a todos; Ya que aun cuando se dice que el tren no afectará pues es inversión privada se ignoran todos los costos escondidos aunados a un cambio de infraestructura en calles principales de la ciudad."


const runPrompt = async (peticion) => {
   const prompt = `Que caterogira le darias (para facil categorizacion) y cual es el tema de la siguiente peticion ciudadana en cuatro palabras, y tambien ayudame a identificar si el mensaje tiene una ubicacion, coordenadas, o direccion: "${peticion}"`;


   const response = await openai.createCompletion({
       model: "text-davinci-003",
       prompt: prompt,
       max_tokens: 2048,
       temperature: 1,
   });


   const tema = response.data.choices[0].text;
   console.log(tema);
}




runPrompt(peticion);
