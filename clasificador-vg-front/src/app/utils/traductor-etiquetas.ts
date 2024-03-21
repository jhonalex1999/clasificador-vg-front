export class TraductorEtiquetas {
  static traducirColumnas(dataframe: any[]): void {
    this.traducirPacienteHospitalizado(dataframe);
    this.traducirCondicionFinal(dataframe);
    this.traducirNaturaleza(dataframe);
    this.traducirActividad(dataframe);
    this.traducirSustanciasVictima(dataframe);
    this.traducirEscenario(dataframe);
    this.traducirViolenciaIntrafamiliar(dataframe);
    this.traducirVictimaMenorDeEdad(dataframe);
    this.traducirAgresorMenorDeEdad(dataframe);
  }

  private static traducirPacienteHospitalizado(dataframe: any[]): void {
    // Verificar si la columna 'paciente_hospitalizado' existe en el dataframe
    if (!dataframe[0]?.hasOwnProperty("paciente_hospitalizado")) {
      console.error(
        'La columna "paciente_hospitalizado" no existe en el dataframe.'
      );
      return;
    }

    /* Se mapean los valores de las columnas para que en lugar de mostrar
    valores numericos muestre etiquetas mas dsecriptivas
    */
    dataframe.forEach((item) => {
      const valorOriginal = item["paciente_hospitalizado"];
      if (valorOriginal === "1") {
        item["paciente_hospitalizado"] = "Si";
      } else if (valorOriginal === "2") {
        item["paciente_hospitalizado"] = "No";
      }
    });
  }

  private static traducirCondicionFinal(dataframe: any[]): void {
    // Verificar si la columna 'Condicion_final' existe en el dataframe
    if (!dataframe[0]?.hasOwnProperty("condicion_final")) {
      console.error('La columna "condicion_final" no existe en el dataframe.');
      return;
    }

    // Mapear los valores de la columna 'Condicion_final'
    dataframe.forEach((item) => {
      const valorOriginal = item["condicion_final"];
      switch (valorOriginal) {
        case "0":
          item["condicion_final"] = "Vivo";
          break;
        case "1":
          item["condicion_final"] = "Muerto";
          break;
        case "2":
          item["condicion_final"] = "No sabe-no responde";
          break;
      }
    });
  }

  private static traducirNaturaleza(dataframe: any[]): void {
    // Verificar si la columna 'naturaleza' existe en el dataframe
    if (!dataframe[0]?.hasOwnProperty("naturaleza")) {
      console.error('La columna "naturaleza" no existe en el dataframe.');
      return;
    }

    // Mapear los valores de la columna 'naturaleza'
    dataframe.forEach((item) => {
      const valorOriginal = item["naturaleza"];
      switch (valorOriginal) {
        case 0:
          item["naturaleza"] = "1. Violencia física o psicológica";
          break;
        case 1:
          item["naturaleza"] = "2. Abuso sexual";
          break;
        case 2:
          item["naturaleza"] = "3. Negligencia y abandono";
          break;
      }
    });
  }

  private static traducirActividad(dataframe: any[]): void {
    // Verificar si la columna 'actividad' existe en el dataframe
    if (!dataframe[0]?.hasOwnProperty("actividad")) {
      console.error('La columna "actividad" no existe en el dataframe.');
      return;
    }

    /* Se mapean los valores de las columnas para que en lugar de mostrar
      valores numéricos muestre etiquetas más descriptivas
    */
    dataframe.forEach((item) => {
      const valorOriginal = item["actividad"];
      switch (valorOriginal) {
        case "13":
          item["actividad"] = "Líderes cívicos(as)";
          break;
        case "15":
          item["actividad"] = "Maestros(as)";
          break;
        case "16":
          item["actividad"] = "Servidor público(a)";
          break;
        case "17":
          item["actividad"] = "Fuerza pública";
          break;
        case "24":
          item["actividad"] = "Estudiante";
          break;
        case "26":
          item["actividad"] = "Otro";
          break;
        case "28":
          item["actividad"] = "Trabajadora doméstica";
          break;
        case "29":
          item["actividad"] = "Persona en situación de prostitución";
          break;
        case "31":
          item["actividad"] = "Persona dedicada al cuidado del hogar";
          break;
        case "33":
          item["actividad"] = "Ninguna";
          break;
        case "8":
          item["actividad"] = "Reciclador(a)";
          break;
      }
    });
  }

  private static traducirSustanciasVictima(dataframe: any[]): void {
    // Verificar si la columna 'sustancias_victima' existe en el dataframe
    if (!dataframe[0]?.hasOwnProperty("sustancias_victima")) {
      console.error(
        'La columna "sustancias_victima" no existe en el dataframe.'
      );
      return;
    }

    /* Se mapean los valores de las columnas para que en lugar de mostrar
      valores numéricos muestre etiquetas más descriptivas
    */
    dataframe.forEach((item) => {
      const valorOriginal = item["sustancias_victima"];
      if (valorOriginal === "1") {
        item["sustancias_victima"] = "Si";
      } else if (valorOriginal === "2") {
        item["sustancias_victima"] = "No";
      }
    });
  }

  private static traducirEscenario(dataframe: any[]): void {
    // Verificar si la columna 'escenario' existe en el dataframe
    if (!dataframe[0]?.hasOwnProperty("escenario")) {
      console.error('La columna "escenario" no existe en el dataframe.');
      return;
    }

    /* Se mapean los valores de las columnas para que en lugar de mostrar
      valores numéricos muestre etiquetas más descriptivas
    */
    dataframe.forEach((item) => {
      const valorOriginal = item["escenario"];
      switch (valorOriginal) {
        case "1":
          item["escenario"] = "Vía pública";
          break;
        case "10":
          item["escenario"] =
            "Lugares de esparcimiento con expendido de alcohol";
          break;
        case "11":
          item["escenario"] = "Institución de salud";
          break;
        case "12":
          item["escenario"] = "Área deportiva y recreativa";
          break;
        case "2":
          item["escenario"] = "Vivienda";
          break;
        case "3":
          item["escenario"] = "Establecimiento educativo";
          break;
        case "4":
          item["escenario"] = "Lugar de trabajo";
          break;
        case "7":
        case "9":
          item["escenario"] =
            "Otros espacios abiertos (bosques, potreros, etc)";
          break;
        case "8":
          item["escenario"] =
            "Comercio y áreas de servicios (Tienda, centro comercial, etc)";
          break;
      }
    });
  }

  private static traducirViolenciaIntrafamiliar(dataframe: any[]): void {
    this.traducirBooleano(dataframe, "violencia_intrafamiliar");
  }

  private static traducirVictimaMenorDeEdad(dataframe: any[]): void {
    this.traducirBooleano(dataframe, "victima_menor_de_edad");
  }

  private static traducirAgresorMenorDeEdad(dataframe: any[]): void {
    this.traducirBooleano(dataframe, "agresor_menor_de_edad");
  }

  private static traducirBooleano(dataframe: any[], columna: string): void {
    // Verificar si la columna existe en el dataframe
    if (!dataframe[0]?.hasOwnProperty(columna)) {
      console.error(`La columna "${columna}" no existe en el dataframe.`);
      return;
    }

    // Mapear los valores booleanos usando switch
    dataframe.forEach((item) => {
      const valorOriginal = item[columna];
      switch (valorOriginal) {
        case "0":
          item[columna] = "Sí";
          break;
        case "1":
          item[columna] = "No";
          break;
      }
    });
  }
}
