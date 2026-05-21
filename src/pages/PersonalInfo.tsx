// src/pages/PersonalInfoPage.tsx
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';

const PersonalInfoPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16 max-w-[1300px]">
        <div className="text-center mb-12 mt-20">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4">СОГЛАСИЕ</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#764cfa]">на обработку персональных данных</h2>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700">
          <div className="bg-gray-50 p-6 rounded-xl mb-8">
            <p className="text-gray-700 mb-2">
              <strong>Оператор:</strong> ООО «Мосзапуск» (ОГРН 1257700065039, ИНН 9734011098, адрес: 123098, г. Москва, ул. Рогова, д. 12, оф. пом. 2П).
            </p>
          </div>

          <p className="text-gray-700 mb-6">
            Заполняя форму на сайте ifou.ru и отмечая чекбокс «Я даю согласие», я, свободно, своей волей и в своем интересе, 
            даю согласие Оператору на обработку следующих моих персональных данных:
          </p>

          <ul className="list-disc pl-6 text-gray-700 mb-6">
            <li>номер телефона;</li>
            <li>адрес электронной почты (e-mail).</li>
          </ul>

          <p className="text-gray-700 font-semibold mt-4 mb-2">Цель обработки:</p>
          <p className="text-gray-700 mb-6">регистрация для участия в бета-тестировании мессенджера IFOU, а также получение информационных сообщений о его запуске и условиях участия.</p>

          <p className="text-gray-700 font-semibold mt-4 mb-2">Срок обработки:</p>
          <p className="text-gray-700 mb-6">до завершения бета-тестирования и в течение 1 (одного) года после, либо до момента отзыва мною настоящего согласия (в зависимости от того, что наступит раньше).</p>

          <p className="text-gray-700 font-semibold mt-4 mb-2">Правовые основания обработки:</p>
          <p className="text-gray-700 mb-6">обработка персональных данных осуществляется на основании настоящего согласия (п. 1 ч. 1 ст. 6 152-ФЗ), а также в связи с заключением и исполнением пользовательского соглашения (п. 5 ч. 1 ст. 6 152-ФЗ) после регистрации пользователя в приложении IFOU.</p>

          <p className="text-gray-700 font-semibold mt-4 mb-2">Перечень действий с персональными данными:</p>
          <p className="text-gray-700 mb-6">Оператор осуществляет сбор, запись, систематизацию, накопление, хранение, уточнение, извлечение, использование, передачу (в том числе трансграничную), обезличивание, блокирование, удаление и уничтожение персональных данных. Обработка осуществляется как с использованием средств автоматизации, так и без них.</p>

          <p className="text-gray-700 font-semibold mt-4 mb-2">Передача третьим лицам:</p>
          <p className="text-gray-700 mb-3">Оператор вправе передавать персональные данные третьим лицам только в следующих случаях:</p>
          <ul className="list-disc pl-6 text-gray-700 mb-6">
            <li>для обеспечения технической реализации рассылки информационных сообщений (сервисы email- и SMS-рассылок) на основании договоров-поручений;</li>
            <li>по запросу уполномоченных государственных органов в случаях, предусмотренных законодательством РФ;</li>
            <li>с отдельного письменного согласия субъекта персональных данных.</li>
          </ul>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-gray-700">
              <strong>Согласие на обработку персональных данных, разрешенных для распространения, мною не дается.</strong> 
              Оператор не вправе передавать мои данные неограниченному кругу лиц.
            </p>
          </div>

          <p className="text-gray-700 mb-6">
            Обработка персональных данных осуществляется Оператором в соответствии с{' '}
            <a href="/privacy" className="text-[#764cfa] hover:underline">Политикой конфиденциальности</a>, 
            размещенной на сайте ifou.ru.
          </p>

          <p className="text-gray-700 font-semibold mt-4 mb-2">Отзыв согласия:</p>
          <p className="text-gray-700 mb-6">
            настоящее согласие может быть отозвано мною путем направления письменного уведомления на адрес электронной почты Оператора: 
            <a href="mailto:info@moszapusk.ru" className="text-[#764cfa] hover:underline"> info@moszapusk.ru</a> 
            с пометкой «Отзыв согласия на обработку ПД». В случае отзыва согласия Оператор обязан прекратить обработку моих 
            персональных данных и уничтожить их в течение 30 (тридцати) календарных дней, если иное не предусмотрено федеральным законом.
          </p>

          <div className="bg-gray-100 p-6 rounded-xl mt-8 text-center">
            <p className="text-gray-700">
              <strong>Дата начала действия согласия:</strong> дата заполнения формы и отметки чекбокса на сайте ifou.ru.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PersonalInfoPage;