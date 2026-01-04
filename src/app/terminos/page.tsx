'use client'

import Link from 'next/link'

export default function TerminosPage() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Términos y Condiciones de Uso</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-sm text-gray-500 mb-8">Última actualización: Enero 2025</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introducción</h2>
            <p className="text-gray-700 mb-4">
              Estos términos y condiciones de uso (los &quot;Términos y Condiciones&quot;), junto con el aviso de privacidad,
              regulan su acceso al sitio web goprismamx.com (la &quot;Plataforma&quot;), así como a los productos y servicios
              en general que son operados y puestos a disposición por Prisma Real Estate, con operaciones en Tepic, Nayarit, México
              (los &quot;Servicios&quot;).
            </p>
            <p className="text-gray-700 mb-4">
              Al acceder, navegar y/o utilizar la Plataforma, usted reconoce que entiende y acepta de manera expresa
              todos los Términos y Condiciones, los cuales crean y regulan la relación entre cualquier usuario de la
              Plataforma (el &quot;Usuario&quot;) y Prisma Real Estate.
            </p>
            <p className="text-gray-700">
              Si no acepta los Términos y Condiciones, el Usuario no podrá acceder ni utilizar la Plataforma.
              Prisma Real Estate se reserva el derecho a no prestar los Servicios a cualquier persona que no acepte
              en su totalidad los presentes Términos y Condiciones.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Definiciones</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Anuncio:</strong> Cualquier publicación en la Plataforma ofreciendo la venta o arrendamiento de bienes inmuebles.</li>
              <li><strong>Inmueble:</strong> Cualquier bien inmueble que sea objeto de un Anuncio en la Plataforma.</li>
              <li><strong>Propietario:</strong> Persona física o moral que sea propietaria o tenga facultades sobre un inmueble anunciado.</li>
              <li><strong>Usuario:</strong> Cualquier persona que acceda o utilice la Plataforma.</li>
              <li><strong>Listado:</strong> Cualquier publicación de propiedad en la Plataforma por Prisma Real Estate.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Uso de la Plataforma</h2>

            <h3 className="text-lg font-medium text-gray-900 mb-2">3.1 Acceso</h3>
            <p className="text-gray-700 mb-4">
              El acceso y uso de la Plataforma no exige la previa suscripción o registro del Usuario.
              Sin embargo, para contactar a propietarios o solicitar información sobre inmuebles,
              el Usuario deberá proporcionar ciertos datos de contacto.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mb-2">3.2 Capacidad</h3>
            <p className="text-gray-700 mb-4">
              Podrán usar la Plataforma todas las personas mayores de edad que tengan capacidad legal
              para contratar conforme a la legislación mexicana aplicable.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mb-2">3.3 Datos Personales</h3>
            <p className="text-gray-700">
              Cuando utilice los formularios de contacto, se le pedirá que proporcione ciertos datos
              personales incluyendo nombre y número telefónico. El tratamiento de estos datos se
              realizará conforme a nuestro Aviso de Privacidad.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Alcance de los Servicios</h2>

            <h3 className="text-lg font-medium text-gray-900 mb-2">4.1 Servicios de Información</h3>
            <p className="text-gray-700 mb-4">
              Prisma Real Estate es una plataforma de información inmobiliaria que permite a los Usuarios
              buscar y conocer propiedades disponibles para venta o renta en Tepic, Nayarit y zonas aledañas.
              Prisma Real Estate actúa como intermediario de información entre propietarios/vendedores y compradores/arrendatarios potenciales.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mb-2">4.2 Listados</h3>
            <p className="text-gray-700">
              La Plataforma contiene propiedades publicadas directamente por Prisma Real Estate.
              Prisma Real Estate puede actuar como intermediario facilitando el contacto entre usuarios interesados
              y los propietarios de los inmuebles, pudiendo recibir una comisión por
              dicha intermediación conforme a las prácticas del mercado inmobiliario.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mb-2">4.3 Servicios de Intermediación</h3>
            <p className="text-gray-700">
              Prisma Real Estate puede ofrecer servicios de intermediación inmobiliaria, ayudando a conectar
              compradores y vendedores, o arrendadores y arrendatarios. Las comisiones por dichos
              servicios serán acordadas caso por caso.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Responsabilidades</h2>
            <p className="text-gray-700 mb-4">
              El Usuario declara y acepta que el uso de la Plataforma y los Servicios se efectúa
              bajo su única y exclusiva responsabilidad. Prisma Real Estate no se hace responsable por:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Cualquier operación realizada directamente entre usuarios, propietarios, compradores o arrendatarios.</li>
              <li>La veracidad, exactitud o actualización de la información proporcionada en los Anuncios, especialmente en Listados de Terceros.</li>
              <li>La titularidad de los propietarios sobre los inmuebles o su facultad para venderlos o arrendarlos.</li>
              <li>Documentación, información o datos personales desactualizados, incompletos o inexactos.</li>
              <li>La disponibilidad y continuidad del funcionamiento de la Plataforma.</li>
              <li>Errores en la transmisión de datos o la calidad de la conexión a Internet.</li>
              <li>Daños directos, indirectos o consecuentes que resulten del uso de la Plataforma.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Descargo de Responsabilidad</h2>
            <p className="text-gray-700 mb-4">
              El Usuario reconoce y acepta que:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Prisma Real Estate no garantiza la disponibilidad, precio actual o condiciones de los inmuebles publicados.</li>
              <li>El Usuario debe verificar toda la información directamente con el asesor antes de tomar cualquier decisión.</li>
              <li>Prisma Real Estate actúa como facilitador de información e intermediario inmobiliario.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Propiedad Intelectual</h2>
            <p className="text-gray-700 mb-4">
              Los Usuarios reconocen que Prisma Real Estate es titular de los derechos de propiedad intelectual
              relacionados con la Plataforma, incluyendo el diseño, código, textos, gráficas, imágenes
              y logotipos propios.
            </p>
            <p className="text-gray-700">
              Queda prohibido realizar &quot;web scraping&quot; en la Plataforma, copiar, publicar o comercializar
              el contenido disponible sin autorización expresa por escrito de Prisma Real Estate.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Indemnización</h2>
            <p className="text-gray-700">
              Cada Usuario acepta defender, indemnizar y mantener libre de responsabilidad a Prisma Real Estate,
              sus directivos, empleados y representantes, frente a cualquier reclamación que surja de
              o esté relacionada con: (a) cualquier incumplimiento de los Términos y Condiciones;
              (b) la falsedad de cualquier información proporcionada por el Usuario; y
              (c) cualquier interacción con otros Usuarios o terceros.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Modificaciones</h2>
            <p className="text-gray-700">
              Prisma Real Estate podrá modificar en cualquier momento los presentes Términos y Condiciones.
              Las modificaciones serán efectivas desde su publicación en la Plataforma. El uso
              continuado de la Plataforma después de cualquier modificación constituye la aceptación
              de los nuevos términos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Ley Aplicable y Jurisdicción</h2>
            <p className="text-gray-700">
              Los presentes Términos y Condiciones se rigen por las leyes vigentes de los Estados Unidos Mexicanos.
              Para todos los asuntos referentes a la interpretación o cumplimiento de estos Términos,
              las partes se someten a la jurisdicción de los tribunales competentes ubicados en
              Tepic, Nayarit, México, renunciando a cualquier otro fuero que pudiera corresponderles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Contacto</h2>
            <p className="text-gray-700">
              Para cualquier duda o aclaración sobre estos Términos y Condiciones, puede contactarnos
              a través del formulario de contacto disponible en la Plataforma.
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
