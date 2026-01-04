'use client'

import Link from 'next/link'

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <img src="/favicon.png" alt="Prisma" className="w-10 h-10" />
              <span className="text-xl font-bold text-gray-900">Prisma</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Aviso de Privacidad</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-sm text-gray-500 mb-8">Última actualización: Enero 2025</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introducción y Alcance</h2>
            <p className="text-gray-700 mb-4">
              En cumplimiento a lo previsto en la Ley Federal de Protección de Datos Personales en Posesión
              de los Particulares (la &quot;Ley de Protección de Datos Personales&quot;) y su Reglamento, Prisma Real Estate,
              con operaciones en Tepic, Nayarit, México, es responsable del tratamiento legítimo, controlado
              e informado de sus Datos Personales, los cuales se compromete a tratar en apego a los principios
              establecidos en la legislación aplicable y de conformidad con los propósitos establecidos en el
              presente Aviso de Privacidad.
            </p>
            <p className="text-gray-700">
              El presente Aviso de Privacidad aplica al sitio web goprismamx.com (la &quot;Plataforma&quot;) y a todos
              los servicios prestados por Prisma Real Estate.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Compromiso con la Privacidad</h2>
            <p className="text-gray-700 mb-4">
              Prisma Real Estate respeta la privacidad de toda persona que proporcione sus Datos Personales al
              visitar o utilizar la Plataforma.
            </p>
            <p className="text-gray-700 mb-4">
              Este Aviso de Privacidad detalla:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
              <li>Los Datos Personales que Prisma Real Estate puede obtener de usted</li>
              <li>Las finalidades de dicha obtención</li>
              <li>El tratamiento que Prisma Real Estate dará a sus Datos Personales</li>
              <li>La transferencia de sus Datos Personales</li>
              <li>Los derechos que usted tiene respecto del tratamiento de sus Datos Personales</li>
            </ul>
            <p className="text-gray-700">
              Al utilizar y navegar en la Plataforma y/o contactar sobre cualquier propiedad, usted otorga
              su consentimiento expreso para el tratamiento de sus Datos Personales conforme a lo previsto
              en este Aviso de Privacidad.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Datos Personales que Recopilamos</h2>
            <p className="text-gray-700 mb-4">
              Los Datos Personales que Prisma Real Estate puede recopilar incluyen:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Datos de identificación:</strong> Nombre completo</li>
              <li><strong>Datos de contacto:</strong> Número telefónico, correo electrónico (si se proporciona)</li>
              <li><strong>Datos de navegación:</strong> Dirección IP, tipo de navegador, páginas visitadas, tiempo de permanencia</li>
              <li><strong>Datos de preferencias:</strong> Propiedades de interés, tipo de inmueble buscado, rango de precios</li>
              <li><strong>Datos de comunicación:</strong> Mensajes enviados a través de formularios de contacto</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Finalidades del Tratamiento</h2>
            <p className="text-gray-700 mb-4">
              Los Datos Personales recabados serán tratados para las siguientes finalidades primarias:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Atender sus solicitudes de información sobre propiedades</li>
              <li>Facilitar la comunicación entre usted y los propietarios o vendedores de inmuebles</li>
              <li>Prestar servicios de intermediación inmobiliaria</li>
              <li>Dar seguimiento a las consultas realizadas</li>
              <li>Mantener nuestras bases de datos actualizadas</li>
              <li>Cumplir con obligaciones legales aplicables</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Finalidades secundarias:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Enviar información sobre propiedades que puedan ser de su interés</li>
              <li>Realizar estudios de mercado y estadísticas</li>
              <li>Mejorar nuestros servicios y la experiencia del usuario</li>
              <li>Enviar comunicaciones promocionales (con su consentimiento)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Transferencia de Datos Personales</h2>
            <p className="text-gray-700 mb-4">
              Sus Datos Personales podrán ser transferidos a:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li><strong>Propietarios de inmuebles:</strong> Para facilitar el contacto respecto a propiedades de su interés</li>
              <li><strong>Colaboradores y asesores inmobiliarios:</strong> Para prestar servicios de intermediación</li>
              <li><strong>Autoridades competentes:</strong> Cuando sea requerido por ley</li>
            </ul>
            <p className="text-gray-700">
              No es necesario obtener su consentimiento para las transferencias previstas en el artículo 37
              de la Ley de Protección de Datos Personales.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Cookies y Tecnologías de Rastreo</h2>
            <p className="text-gray-700 mb-4">
              La Plataforma utiliza cookies y tecnologías similares para:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Mejorar su experiencia de navegación</li>
              <li>Recordar sus preferencias</li>
              <li>Analizar el uso de la Plataforma</li>
              <li>Garantizar la seguridad de la navegación</li>
            </ul>
            <p className="text-gray-700">
              Puede configurar su navegador para rechazar cookies, aunque esto podría afectar
              el funcionamiento de algunas características de la Plataforma.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Protección de sus Datos</h2>
            <p className="text-gray-700 mb-4">
              Prisma Real Estate ha implementado medidas de seguridad administrativas, técnicas y físicas
              para proteger sus Datos Personales contra daño, pérdida, alteración, destrucción
              o uso no autorizado.
            </p>
            <p className="text-gray-700">
              A pesar de estas medidas, usted reconoce que ningún sistema de seguridad es completamente
              infalible y que existen riesgos inherentes a la transmisión de información por Internet.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Derechos ARCO</h2>
            <p className="text-gray-700 mb-4">
              Usted tiene derecho a:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li><strong>Acceso:</strong> Conocer qué Datos Personales tenemos sobre usted</li>
              <li><strong>Rectificación:</strong> Solicitar la corrección de sus datos si son inexactos</li>
              <li><strong>Cancelación:</strong> Solicitar la eliminación de sus datos</li>
              <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos para fines específicos</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Para ejercer sus derechos ARCO, deberá presentar una solicitud que contenga:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Nombre completo y datos de contacto</li>
              <li>Descripción clara de los datos sobre los que desea ejercer sus derechos</li>
              <li>Descripción de su solicitud</li>
              <li>Cualquier documento que facilite la localización de sus datos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Revocación del Consentimiento</h2>
            <p className="text-gray-700">
              Usted puede revocar en cualquier momento el consentimiento que ha otorgado para el
              tratamiento de sus Datos Personales, en la medida en que la ley lo permita. Para
              hacerlo, puede contactarnos a través de los medios indicados en la Plataforma.
              Tenga en cuenta que la revocación podría afectar nuestra capacidad de prestarle
              ciertos servicios.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Menores de Edad</h2>
            <p className="text-gray-700">
              Prisma Real Estate no tiene intención de recopilar Datos Personales de menores de edad.
              Los servicios de la Plataforma están dirigidos a personas mayores de edad con
              capacidad legal para realizar transacciones inmobiliarias.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Enlaces Externos</h2>
            <p className="text-gray-700">
              La Plataforma puede contener enlaces a otros sitios de Internet. Prisma Real Estate no es
              responsable por las prácticas de privacidad de dichos sitios. Le recomendamos
              consultar los avisos de privacidad de cada sitio que visite.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Modificaciones al Aviso de Privacidad</h2>
            <p className="text-gray-700">
              Prisma Real Estate se reserva el derecho de modificar este Aviso de Privacidad en cualquier momento.
              Las modificaciones serán publicadas en esta misma página de la Plataforma, siendo obligación
              de los usuarios revisar regularmente esta sección.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Ley Aplicable</h2>
            <p className="text-gray-700">
              El presente Aviso de Privacidad se rige por las leyes de los Estados Unidos Mexicanos,
              en particular por la Ley Federal de Protección de Datos Personales en Posesión de los
              Particulares y su Reglamento.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">14. Quejas y Denuncias</h2>
            <p className="text-gray-700">
              Si considera que su derecho de protección de Datos Personales ha sido vulnerado,
              puede presentar una queja o denuncia ante el Instituto Nacional de Transparencia,
              Acceso a la Información y Protección de Datos Personales (INAI).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">15. Contacto</h2>
            <p className="text-gray-700">
              Para cualquier duda, comentario o para ejercer sus derechos relacionados con sus
              Datos Personales, puede contactarnos a través del formulario de contacto disponible
              en la Plataforma.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
            &larr; Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  )
}
