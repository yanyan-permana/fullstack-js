-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 23 Des 2022 pada 14.06
-- Versi server: 10.4.21-MariaDB
-- Versi PHP: 7.4.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fullstack_js`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `movies`
--

CREATE TABLE `movies` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `released` date DEFAULT NULL,
  `runtime` varchar(255) DEFAULT NULL,
  `genre` varchar(255) DEFAULT NULL,
  `director` varchar(255) DEFAULT NULL,
  `writer` varchar(255) DEFAULT NULL,
  `actors` varchar(255) DEFAULT NULL,
  `plot` varchar(255) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `poster` varchar(255) DEFAULT NULL,
  `rating` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `movies`
--

INSERT INTO `movies` (`id`, `title`, `year`, `released`, `runtime`, `genre`, `director`, `writer`, `actors`, `plot`, `language`, `country`, `poster`, `rating`, `createdAt`, `updatedAt`) VALUES
(1, 'Peaky Blinders', 2013, '2014-09-30', '60 Min', 'Crime,Drama', 'N/A', 'Steven Knight', 'Cillian Murphy, Paul Anderson, Sophie Rundle', 'A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps, and their fierce boss Tommy Shelby.', 'English,Romanian,Irish Gaelic,Italian,Yiddish,French', 'United Kingdom', '1671174364489.jpg', '8.8/10', '2022-12-16 14:06:04', '2022-12-16 14:06:04'),
(2, 'Dilan 1991', 2019, '2019-02-28', '121 Min', 'Drama,Romance', 'Pidi Baiq, Fajar Bustomi', 'Pidi Baiq, Titien Wattimena', 'Iqbaal Dhiafakhri Ramadhan, Vanesha Prescilla, Ira Wibowo', 'Dilan and Milea officially date. But Dilan is threatened to be expelled from school due to involves in gang fights. One day, when he is planning to fight again, Milea asks him to quit the motorcycle gang or their relationship ends.', 'Indonesia', 'Indonesia', '1671174680266.jpg', '6.5/10', '2022-12-16 14:11:20', '2022-12-16 14:11:20'),
(3, 'Vincenzo', 2021, '2021-02-20', '52 Min', 'Action,Drama,Comedy', 'N/A', 'N/A', 'Song Joong-ki, Jeon Yeo-bin, Taecyeon', 'During a visit to his motherland, a Korean-Italian mafia lawyer gives an unrivaled conglomerate a taste of its own medicine with a side of justice.', 'Korean', 'South Korea', '1671174990715.jpg', '8.4/10', '2022-12-16 14:16:30', '2022-12-16 14:16:30'),
(6, 'q1', 2020, '2020-04-06', 'q1', 'Action,Comedy,Crime', 'w1', 'e1', 'r1', 't1', 'Italian,Korean,Yiddish', 'South Korea,Italian', '1671754374518.png', 'y1', '2022-12-22 20:02:53', '2022-12-23 07:12:54');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `movies`
--
ALTER TABLE `movies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
