import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { esquemaInscripcion } from "../datos/esquemas.js";
import { DIAS, JUEGOS, NIVELES, textoFormato } from "../datos/juegos.js";
import Campo, { MensajeError, ariaDelCampo } from "./Campo.jsx";

const VALORES_INICIALES = {
  nombre: "",
  capitan: "",
  email: "",
  nacimiento: "",
  juego: "",
  jugadores: "",
  nivel: "",
  dias: [],
  normas: false,
};

export default function FormularioInscripcion() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(esquemaInscripcion), // Zod decide qué es válido y con qué mensaje
    defaultValues: VALORES_INICIALES,
  });

  // Solo se llama con datos ya validados. De momento simula el envío.
  async function onSubmit(datos) {
    await new Promise((resolver) => setTimeout(resolver, 800));
    console.log("Inscripción válida:", datos);
  }

  return (
    <form className="formulario" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="fila">
        <Campo id="nombre" etiqueta="Nombre del equipo" error={errors.nombre}>
          <input type="text" autoComplete="off" {...ariaDelCampo("nombre", errors.nombre)} {...register("nombre")} />
        </Campo>
        <Campo id="capitan" etiqueta="Capitán o capitana" error={errors.capitan}>
          <input type="text" autoComplete="name" {...ariaDelCampo("capitan", errors.capitan)} {...register("capitan")} />
        </Campo>
      </div>

      <div className="fila">
        <Campo id="email" etiqueta="Email de contacto" error={errors.email} ayuda="Solo correos de la U-tad.">
          <input
            type="email"
            autoComplete="email"
            placeholder="nombre@live.u-tad.com"
            {...ariaDelCampo("email", errors.email, true)}
            {...register("email")}
          />
        </Campo>
        <Campo id="nacimiento" etiqueta="Fecha de nacimiento del capitán" error={errors.nacimiento} ayuda="Mínimo 16 años.">
          <input
            type="date"
            autoComplete="bday"
            {...ariaDelCampo("nacimiento", errors.nacimiento, true)}
            {...register("nacimiento")}
          />
        </Campo>
      </div>

      <div className="fila">
        <Campo id="juego" etiqueta="Juego" error={errors.juego}>
          {/* deps: al cambiar de juego se revalida también el número de jugadores */}
          <select {...ariaDelCampo("juego", errors.juego)} {...register("juego", { deps: ["jugadores"] })}>
            <option value="">Elige un juego…</option>
            {JUEGOS.map((juego) => (
              <option key={juego.id} value={juego.id}>
                {juego.nombre} ({textoFormato(juego)})
              </option>
            ))}
          </select>
        </Campo>
        <Campo id="jugadores" etiqueta="Número de jugadores" error={errors.jugadores} ayuda="Titulares más suplentes.">
          <input
            type="number"
            inputMode="numeric"
            min="1"
            {...ariaDelCampo("jugadores", errors.jugadores, true)}
            {...register("jugadores")}
          />
        </Campo>
      </div>

      {/* Grupo de radios: fieldset + legend para que el lector anuncie la pregunta una vez */}
      <fieldset className="grupo" aria-describedby={errors.nivel ? "error-nivel" : undefined}>
        <legend>Nivel del equipo</legend>
        <div className="opciones">
          {NIVELES.map((nivel) => (
            <label key={nivel.id} className="opcion">
              <input type="radio" value={nivel.id} aria-invalid={errors.nivel ? "true" : "false"} {...register("nivel")} />
              {nivel.nombre}
            </label>
          ))}
        </div>
        <MensajeError id="nivel" error={errors.nivel} />
      </fieldset>

      {/* Checkboxes con el mismo nombre: RHF los junta en un array (["lunes", "jueves"]) */}
      <fieldset className="grupo" aria-describedby={errors.dias ? "error-dias" : undefined}>
        <legend>Días en los que podéis jugar</legend>
        <div className="opciones">
          {DIAS.map((dia) => (
            <label key={dia.id} className="opcion">
              <input type="checkbox" value={dia.id} aria-invalid={errors.dias ? "true" : "false"} {...register("dias")} />
              {dia.nombre}
            </label>
          ))}
        </div>
        <MensajeError id="dias" error={errors.dias} />
      </fieldset>

      <div className="campo">
        <label className="normas">
          <input type="checkbox" {...ariaDelCampo("normas", errors.normas)} {...register("normas")} />
          Acepto las normas del torneo: juego limpio, puntualidad y nada de cuentas prestadas.
        </label>
        <MensajeError id="normas" error={errors.normas} />
      </div>

      {/* Deshabilitado solo mientras se envía: nunca "hasta que sea válido" */}
      <button type="submit" className="boton" disabled={isSubmitting}>
        {isSubmitting ? "Inscribiendo…" : "Inscribir equipo"}
      </button>

      {isSubmitSuccessful && (
        <p role="status" className="mensaje mensaje--ok">
          Formulario válido.
        </p>
      )}
    </form>
  );
}
