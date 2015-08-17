-- phpMyAdmin SQL Dump
-- version 4.0.10.6
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1:3306
-- Время создания: Авг 01 2015 г., 00:22
-- Версия сервера: 5.5.41-log
-- Версия PHP: 5.4.35

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `clubs`
--
CREATE DATABASE IF NOT EXISTS `clubs` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `clubs`;

-- --------------------------------------------------------

--
-- Структура таблицы `clubs`
--

DROP TABLE IF EXISTS `clubs`;
CREATE TABLE IF NOT EXISTS `clubs` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `games` tinyint(3) unsigned NOT NULL,
  `wins` tinyint(3) unsigned NOT NULL,
  `draws` tinyint(3) unsigned NOT NULL,
  `gs` tinyint(3) unsigned NOT NULL,
  `ga` tinyint(3) unsigned NOT NULL,
  `id_country` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_country` (`id_country`),
  KEY `name` (`name`(6))
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=98 ;

--
-- Дамп данных таблицы `clubs`
--

INSERT INTO `clubs` (`id`, `name`, `games`, `wins`, `draws`, `gs`, `ga`, `id_country`) VALUES
(1, 'Chelsea', 38, 28, 6, 79, 35, 1),
(2, 'Liverpool', 38, 26, 5, 84, 48, 1),
(3, 'MU', 38, 26, 4, 80, 43, 1),
(4, 'Arsenal', 38, 24, 8, 82, 58, 1),
(6, 'Roma', 38, 26, 7, 80, 45, 2),
(7, 'Napoli', 38, 25, 5, 90, 55, 2),
(8, 'Fiorentina', 38, 25, 1, 77, 42, 2),
(9, 'Real', 38, 30, 7, 99, 45, 3),
(10, 'Barsa', 38, 28, 8, 92, 48, 3),
(11, 'Athletico Madrid', 38, 27, 6, 77, 45, 3),
(15, 'MC', 38, 20, 10, 79, 55, 1),
(17, 'Totenham', 38, 17, 8, 67, 57, 1),
(20, 'Real Sosedad', 38, 15, 5, 45, 42, 3),
(23, 'Lazio', 38, 25, 6, 71, 52, 2),
(29, 'Juventus', 38, 30, 4, 80, 35, 2),
(30, 'Milan', 38, 16, 10, 60, 57, 2),
(31, 'Inter', 38, 17, 10, 68, 55, 2),
(32, 'Cagliari', 38, 10, 7, 50, 80, 2),
(33, 'Sampdoria', 38, 20, 7, 65, 49, 2),
(36, 'Saughempton', 38, 18, 7, 62, 55, 1),
(38, 'Stoke City', 38, 13, 11, 47, 53, 1),
(39, 'Newcastle', 38, 9, 9, 27, 52, 1),
(43, 'Valencia', 38, 21, 10, 61, 43, 3),
(56, 'Everthon', 38, 15, 8, 48, 47, 1),
(58, 'West Ham', 38, 14, 10, 55, 42, 1),
(59, 'Sevilla', 38, 18, 12, 52, 38, 3),
(61, 'Villareal', 38, 16, 9, 48, 39, 3),
(62, 'Aston Willa', 38, 11, 9, 37, 55, 1),
(63, 'Palermo', 38, 12, 11, 45, 53, 2),
(64, 'Athletic', 38, 14, 10, 37, 40, 3),
(66, 'Sunderland', 38, 9, 11, 30, 48, 1),
(67, 'WBA', 38, 11, 11, 35, 48, 1),
(68, 'Sassuollo', 38, 11, 9, 46, 60, 2),
(69, 'Genoa', 38, 17, 10, 57, 49, 2),
(70, 'Atalanta', 38, 10, 9, 38, 59, 2),
(71, 'Osasyna', 38, 10, 14, 39, 50, 3),
(72, 'Crystal Palace', 38, 10, 10, 40, 60, 1),
(73, 'Syonsi City', 38, 16, 8, 53, 40, 1),
(74, 'Watford', 38, 13, 7, 45, 54, 1),
(75, 'Lester', 38, 7, 14, 30, 59, 1),
(77, 'Norwich', 38, 9, 12, 39, 58, 1),
(79, 'Bornmut', 38, 7, 12, 30, 60, 1),
(80, 'Chievo', 38, 11, 7, 35, 50, 2),
(81, 'Verona', 38, 14, 7, 45, 48, 2),
(82, 'Betis', 38, 11, 8, 40, 56, 3),
(83, 'Deportivo', 38, 9, 9, 35, 52, 3),
(86, 'Bayern Munich', 34, 26, 5, 77, 35, 4),
(87, 'Borussia Dortmund', 34, 22, 8, 72, 43, 4),
(88, 'Bayer Leverkusen', 34, 20, 10, 70, 45, 4),
(89, 'Shalke 04', 34, 17, 9, 65, 48, 4),
(90, 'Borussia Mch', 34, 20, 11, 65, 45, 4),
(91, 'Gamburg', 34, 11, 11, 42, 49, 4),
(92, 'Wolfsburg', 34, 23, 7, 79, 48, 4),
(93, 'Ausburg', 34, 12, 10, 45, 45, 4),
(94, 'Werder', 34, 14, 6, 50, 55, 4),
(95, 'Gerta', 34, 9, 9, 30, 57, 4),
(96, 'Schtutgart', 34, 10, 10, 31, 58, 4),
(97, 'Gannover 96', 34, 12, 8, 35, 50, 4);

-- --------------------------------------------------------

--
-- Структура таблицы `countries`
--

DROP TABLE IF EXISTS `countries`;
CREATE TABLE IF NOT EXISTS `countries` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `min_games` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `max_games` tinyint(3) unsigned NOT NULL,
  `ch_league` tinyint(3) unsigned NOT NULL,
  `eu_league` tinyint(3) unsigned NOT NULL,
  `max_count_clubs` tinyint(3) unsigned NOT NULL,
  `clubs_to_remove` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `name` (`name`(6))
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Дамп данных таблицы `countries`
--

INSERT INTO `countries` (`id`, `name`, `min_games`, `max_games`, `ch_league`, `eu_league`, `max_count_clubs`, `clubs_to_remove`) VALUES
(1, 'england', 0, 38, 4, 6, 20, 3),
(2, 'italy', 0, 38, 3, 6, 20, 3),
(3, 'spain', 0, 38, 4, 7, 20, 3),
(4, 'germany', 0, 34, 4, 6, 18, 3);

-- --------------------------------------------------------

--
-- Структура таблицы `players`
--

DROP TABLE IF EXISTS `players`;
CREATE TABLE IF NOT EXISTS `players` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `age` tinyint(3) unsigned NOT NULL,
  `goals` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `passes` tinyint(3) unsigned NOT NULL,
  `rating` tinyint(3) unsigned NOT NULL,
  `position` tinyint(3) unsigned NOT NULL DEFAULT '1',
  `club_id` smallint(5) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `club_id` (`club_id`),
  KEY `position` (`position`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=107 ;

--
-- Дамп данных таблицы `players`
--

INSERT INTO `players` (`id`, `name`, `age`, `goals`, `passes`, `rating`, `position`, `club_id`) VALUES
(1, 'Diego Costa', 26, 23, 0, 70, 4, 1),
(2, 'Rooney', 29, 21, 0, 70, 4, 3),
(3, 'Balotelli', 25, 13, 0, 70, 4, 2),
(4, 'Tevez', 31, 24, 0, 70, 4, 29),
(5, 'Morata', 22, 14, 0, 70, 4, 29),
(6, 'Icardi', 21, 22, 0, 70, 4, 31),
(7, 'Menez', 27, 13, 0, 70, 5, 30),
(8, 'Cristiano Ronaldo', 30, 36, 0, 70, 5, 9),
(9, 'Messi', 28, 35, 0, 70, 4, 10),
(17, 'Lukaku', 23, 17, 0, 70, 4, 56),
(18, 'Pelle', 29, 15, 0, 70, 4, 36),
(19, 'Higuain', 27, 17, 0, 70, 4, 7),
(20, 'Kloze', 37, 12, 0, 70, 4, 23),
(21, 'Bale', 25, 21, 0, 70, 5, 9),
(22, 'Benzema', 27, 22, 0, 70, 4, 9),
(23, 'Grizman', 22, 22, 0, 70, 4, 11),
(24, 'Totti', 37, 12, 0, 70, 4, 6),
(25, 'Dibala', 22, 17, 0, 70, 4, 29),
(26, 'Caliehon', 28, 14, 0, 70, 5, 7),
(27, 'Torres', 30, 14, 0, 70, 4, 11),
(28, 'Cherishev', 25, 9, 0, 70, 5, 9),
(29, 'Aguero', 27, 22, 0, 70, 4, 15),
(30, 'Sturridge', 26, 19, 0, 70, 4, 2),
(31, 'Baka', 28, 16, 0, 70, 4, 59),
(32, 'Negredo', 30, 10, 0, 70, 4, 43),
(33, 'Suarez', 28, 20, 0, 70, 4, 10),
(34, 'Pedro', 28, 13, 0, 70, 5, 10),
(35, 'Benteke', 24, 18, 0, 70, 4, 62),
(36, 'Welback', 25, 9, 0, 70, 5, 4),
(37, 'Kane', 22, 21, 0, 70, 4, 17),
(38, 'Giry', 28, 10, 0, 70, 4, 4),
(39, 'van Persie', 31, 12, 0, 70, 4, 3),
(40, 'Remy', 28, 12, 0, 70, 4, 1),
(41, 'Palacio', 30, 9, 0, 70, 4, 31),
(42, 'El Shaarawy', 22, 11, 0, 70, 5, 30),
(43, 'Gomes', 30, 10, 0, 70, 4, 8),
(44, 'Eder', 27, 8, 0, 70, 3, 33),
(45, 'Laich', 22, 10, 0, 70, 5, 6),
(46, 'Dumbia', 28, 12, 0, 70, 4, 6),
(47, 'Candreva', 28, 11, 0, 70, 3, 23),
(48, 'Curtua', 22, 0, 0, 70, 1, 1),
(49, 'Cahill', 29, 0, 0, 70, 2, 1),
(50, 'Ivanovic', 31, 0, 0, 70, 2, 1),
(51, 'Matic', 25, 0, 0, 70, 3, 1),
(52, 'Fabregas', 28, 0, 0, 70, 3, 1),
(53, 'Hazard', 24, 17, 18, 94, 5, 1),
(54, 'Cuadrado', 28, 3, 11, 75, 5, 1),
(55, 'Aspilicueta', 26, 0, 0, 70, 2, 1),
(56, 'Zuma', 21, 0, 0, 70, 2, 1),
(57, 'Terry', 34, 0, 0, 70, 2, 1),
(58, 'Felipe Luiz', 30, 0, 0, 70, 2, 11),
(59, 'Yaya Toure', 32, 7, 0, 70, 3, 15),
(61, 'Boni', 27, 14, 0, 70, 4, 15),
(62, 'Dzeko', 29, 10, 0, 70, 4, 15),
(63, 'Kompani', 28, 0, 0, 70, 2, 15),
(64, 'Obi Mikel', 29, 0, 0, 70, 3, 1),
(65, 'Begovic', 28, 0, 0, 70, 1, 1),
(66, 'Ramires', 28, 0, 0, 70, 3, 1),
(67, 'van Ginkel', 22, 0, 0, 70, 3, 1),
(68, 'De Gea', 23, 0, 0, 77, 1, 3),
(69, 'Falcao', 29, 6, 0, 70, 4, 1),
(70, 'Buffon', 35, 0, 0, 70, 1, 29),
(71, 'Marchisio', 29, 8, 0, 70, 3, 29),
(72, 'Pogba', 22, 5, 0, 70, 3, 29),
(73, 'Chiellini', 30, 0, 0, 70, 2, 29),
(74, 'Sanches', 25, 16, 0, 70, 4, 4),
(75, 'Walcott', 27, 10, 0, 70, 4, 4),
(76, 'Soldado', 31, 3, 0, 70, 4, 17),
(77, 'Lamela', 23, 6, 0, 70, 5, 17),
(78, 'Henderson', 26, 6, 0, 70, 3, 2),
(79, 'Coutinho', 25, 7, 0, 70, 3, 2),
(80, 'Schcrtel', 30, 1, 0, 70, 2, 2),
(81, 'Di Maria', 28, 7, 0, 70, 5, 3),
(82, 'Kalach', 21, 0, 1, 81, 2, 1),
(83, 'Miniole', 25, 0, 0, 68, 1, 2),
(84, 'Swainschtaiger', 30, 4, 7, 84, 3, 3),
(85, 'Schnaiderlin', 26, 2, 7, 78, 3, 3),
(86, 'Carrick', 33, 0, 2, 80, 3, 3),
(87, 'Jones', 25, 0, 0, 76, 2, 3),
(88, 'Darmian', 25, 1, 4, 80, 2, 3),
(91, 'Perin', 21, 0, 0, 77, 1, 69),
(92, 'Pinilia', 30, 4, 1, 60, 4, 32),
(93, 'Bonucchi', 28, 0, 3, 82, 2, 29),
(94, 'Defo', 32, 6, 2, 65, 4, 66),
(96, 'Robben', 32, 8, 12, 80, 5, 86),
(97, 'Ribery', 33, 5, 15, 82, 5, 86),
(98, 'Lewandowsky', 26, 20, 4, 72, 4, 86),
(99, 'Noyer', 28, 0, 0, 70, 1, 86),
(100, 'Muller', 26, 15, 10, 83, 4, 86),
(101, 'Vidal', 28, 7, 7, 80, 3, 86),
(102, 'Alaba', 23, 0, 3, 81, 2, 86),
(103, 'Gundogan', 26, 1, 3, 75, 3, 87),
(104, 'Rous', 26, 9, 15, 83, 5, 87),
(105, 'Hummels', 27, 0, 1, 83, 2, 87),
(106, 'Pischcek', 29, 1, 4, 77, 2, 87);

-- --------------------------------------------------------

--
-- Структура таблицы `positions`
--

DROP TABLE IF EXISTS `positions`;
CREATE TABLE IF NOT EXISTS `positions` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Дамп данных таблицы `positions`
--

INSERT INTO `positions` (`id`, `name`) VALUES
(1, 'goalkeeper'),
(2, 'defender'),
(3, 'midfielder'),
(4, 'striker'),
(5, 'winger');

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `clubs`
--
ALTER TABLE `clubs`
  ADD CONSTRAINT `clubs_ibfk_1` FOREIGN KEY (`id_country`) REFERENCES `countries` (`id`);

--
-- Ограничения внешнего ключа таблицы `players`
--
ALTER TABLE `players`
  ADD CONSTRAINT `players_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `players_ibfk_2` FOREIGN KEY (`position`) REFERENCES `positions` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
