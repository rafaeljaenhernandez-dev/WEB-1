import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { esquemaInscripcion } from "../datos/esquemas.js";
import { DIAS, JUEGOS, NIVELES, buscarJuego, textoFormato } from "../datos/juegos.js";
import { useInscribir } from "../hooks/useEquipos.js";
import { ariaDelCampo } from "../datos/accesibilidad.js";
import Campo, { MensajeError } from "./Campo.jsx";
import Celebracion from "./Celebracion.jsx";

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
  const inscripcion = useInscribir();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(esquemaInscripcion), // Zod decide qué es válido y con qué mensaje
    defaultValues: VALORES_INICIALES,
  });

  // RHF solo llama aquí con datos que Zod ya dio por buenos; la mutación hace el POST
  function onSubmit(datos) {
    inscripcion.mutate(datos, {
      onSuccess: () => reset(), // formulario limpio para el siguiente equipo
    });
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

      {/* El juego se elige con tarjetas: por dentro son radios normales con register */}
      <fieldset className="grupo" aria-describedby={errors.juego ? "error-juego" : undefined}>
        <legend>Juego</legend>
        <div className="juegos">
          {JUEGOS.map((juego) => (
            <label key={juego.id} className="juego-opcion" data-juego={juego.id}>
              {/* deps: al cambiar de juego se revalida también el número de jugadores */}
              <input
                type="radio"
                value={juego.id}
                className="juego-opcion__radio"
                aria-invalid={errors.juego ? "true" : "false"}
                {...register("juego", { deps: ["jugadores"] })}
              />
              <span className="emblema" aria-hidden="true">
                {juego.emblema}
              </span>
              <span className="juego-opcion__nombre">{juego.nombre}</span>
              <span className="juego-opcion__formato">{textoFormato(juego)}</span>
            </label>
          ))}
        </div>
        <MensajeError id="juego" error={errors.juego} />
      </fieldset>

      <Campo id="jugadores" etiqueta="Número de jugadores" error={errors.jugadores} ayuda="Titulares más suplentes.">
        <input
          type="number"
          inputMode="numeric"
          min="1"
          {...ariaDelCampo("jugadores", errors.jugadores, true)}
          {...register("jugadores")}
        />
      </Campo>

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
      <button type="submit" className="boton" disabled={inscripcion.isPending}>
        {inscripcion.isPending ? "Inscribiendo…" : "Inscribir equipo"}
      </button>

      {/* Éxito con role="status" (educado) y error del servidor con role="alert" (inmediato) */}
      {inscripcion.isSuccess && (
        <p role="status" className="mensaje mensaje--ok">
          ¡«{inscripcion.data.nombre}» está dentro del torneo de {buscarJuego(inscripcion.data.juego).nombre}!
        </p>
      )}
      {/* Destello de celebración: la key con el id nuevo hace que se repita en cada inscripción */}
      {inscripcion.isSuccess && <Celebracion key={inscripcion.data.id} />}
      {inscripcion.isError && (
        <p role="alert" className="mensaje mensaje--error">
          {inscripcion.error.message}
        </p>
      )}
    </form>
  );
}
