--
-- PostgreSQL database dump
--

-- Dumped from database version 12.9 (Ubuntu 12.9-2.pgdg20.04+1)
-- Dumped by pg_dump version 12.9 (Ubuntu 12.9-2.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE universe;
--
-- Name: universe; Type: DATABASE; Schema: -; Owner: freecodecamp
--

CREATE DATABASE universe WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C.UTF-8' LC_CTYPE = 'C.UTF-8';


ALTER DATABASE universe OWNER TO freecodecamp;

\connect universe

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: galaxy; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.galaxy (
    galaxy_id integer NOT NULL,
    name character varying(50) NOT NULL,
    star_count integer,
    galaxy_types_id integer,
    lightyears_across integer
);


ALTER TABLE public.galaxy OWNER TO freecodecamp;

--
-- Name: galaxy_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.galaxy_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.galaxy_id_seq OWNER TO freecodecamp;

--
-- Name: galaxy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.galaxy_id_seq OWNED BY public.galaxy.galaxy_id;


--
-- Name: galaxy_types; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.galaxy_types (
    name character varying(30) NOT NULL,
    galaxy_types_id integer NOT NULL,
    description text
);


ALTER TABLE public.galaxy_types OWNER TO freecodecamp;

--
-- Name: galaxy_types_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.galaxy_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.galaxy_types_id_seq OWNER TO freecodecamp;

--
-- Name: galaxy_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.galaxy_types_id_seq OWNED BY public.galaxy_types.galaxy_types_id;


--
-- Name: moon; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.moon (
    moon_id integer NOT NULL,
    planet_id integer,
    name character varying(50) NOT NULL,
    size numeric(9,3),
    has_water boolean
);


ALTER TABLE public.moon OWNER TO freecodecamp;

--
-- Name: moon_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.moon_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.moon_id_seq OWNER TO freecodecamp;

--
-- Name: moon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.moon_id_seq OWNED BY public.moon.moon_id;


--
-- Name: planet; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.planet (
    planet_id integer NOT NULL,
    star_id integer,
    name character varying(50) NOT NULL,
    size numeric(9,3),
    description text,
    planet_types_id integer,
    has_life boolean,
    has_water boolean
);


ALTER TABLE public.planet OWNER TO freecodecamp;

--
-- Name: planet_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.planet_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.planet_id_seq OWNER TO freecodecamp;

--
-- Name: planet_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.planet_id_seq OWNED BY public.planet.planet_id;


--
-- Name: planet_types; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.planet_types (
    name character varying(30) NOT NULL,
    planet_types_id integer NOT NULL,
    description text
);


ALTER TABLE public.planet_types OWNER TO freecodecamp;

--
-- Name: planet_types_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.planet_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.planet_types_id_seq OWNER TO freecodecamp;

--
-- Name: planet_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.planet_types_id_seq OWNED BY public.planet_types.planet_types_id;


--
-- Name: star; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.star (
    star_id integer NOT NULL,
    galaxy_id integer,
    name character varying(50) NOT NULL,
    planet_count integer NOT NULL,
    size numeric(16,3),
    star_types_id integer
);


ALTER TABLE public.star OWNER TO freecodecamp;

--
-- Name: star_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.star_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.star_id_seq OWNER TO freecodecamp;

--
-- Name: star_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.star_id_seq OWNED BY public.star.star_id;


--
-- Name: star_types; Type: TABLE; Schema: public; Owner: freecodecamp
--

CREATE TABLE public.star_types (
    name character varying(30) NOT NULL,
    star_types_id integer NOT NULL,
    description text
);


ALTER TABLE public.star_types OWNER TO freecodecamp;

--
-- Name: star_types_id_seq; Type: SEQUENCE; Schema: public; Owner: freecodecamp
--

CREATE SEQUENCE public.star_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.star_types_id_seq OWNER TO freecodecamp;

--
-- Name: star_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: freecodecamp
--

ALTER SEQUENCE public.star_types_id_seq OWNED BY public.star_types.star_types_id;


--
-- Name: galaxy galaxy_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.galaxy ALTER COLUMN galaxy_id SET DEFAULT nextval('public.galaxy_id_seq'::regclass);


--
-- Name: galaxy_types galaxy_types_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.galaxy_types ALTER COLUMN galaxy_types_id SET DEFAULT nextval('public.galaxy_types_id_seq'::regclass);


--
-- Name: moon moon_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon ALTER COLUMN moon_id SET DEFAULT nextval('public.moon_id_seq'::regclass);


--
-- Name: planet planet_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet ALTER COLUMN planet_id SET DEFAULT nextval('public.planet_id_seq'::regclass);


--
-- Name: planet_types planet_types_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet_types ALTER COLUMN planet_types_id SET DEFAULT nextval('public.planet_types_id_seq'::regclass);


--
-- Name: star star_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star ALTER COLUMN star_id SET DEFAULT nextval('public.star_id_seq'::regclass);


--
-- Name: star_types star_types_id; Type: DEFAULT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star_types ALTER COLUMN star_types_id SET DEFAULT nextval('public.star_types_id_seq'::regclass);


--
-- Data for Name: galaxy; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.galaxy VALUES (1, 'Milky Way', 400, 1, 105700);
INSERT INTO public.galaxy VALUES (2, 'Andromeda', 1000, 1, 152000);
INSERT INTO public.galaxy VALUES (3, 'Canis Major Dwarf', 1, 4, 5000);
INSERT INTO public.galaxy VALUES (4, 'Virgo Stellar Stream', 500000, 4, NULL);
INSERT INTO public.galaxy VALUES (6, 'Sagittarius Dwarf Spheroidal', NULL, 2, 10000);
INSERT INTO public.galaxy VALUES (7, 'Large Magellanic Cloud', 20, 1, 32200);


--
-- Data for Name: galaxy_types; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.galaxy_types VALUES ('Spiral', 1, NULL);
INSERT INTO public.galaxy_types VALUES ('Elliptical', 2, NULL);
INSERT INTO public.galaxy_types VALUES ('Lenticular', 3, NULL);
INSERT INTO public.galaxy_types VALUES ('Irregular', 4, NULL);
INSERT INTO public.galaxy_types VALUES ('Active', 5, NULL);
INSERT INTO public.galaxy_types VALUES ('Seyfert', 6, NULL);
INSERT INTO public.galaxy_types VALUES ('Quasars', 7, NULL);
INSERT INTO public.galaxy_types VALUES ('Blazars', 8, NULL);


--
-- Data for Name: moon; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.moon VALUES (1, 3, 'Luna', 0.000, false);
INSERT INTO public.moon VALUES (2, 4, 'Phobos', 0.000, false);
INSERT INTO public.moon VALUES (3, 4, 'Deimos', 0.000, false);
INSERT INTO public.moon VALUES (4, 5, 'Io', 0.000, false);
INSERT INTO public.moon VALUES (5, 5, 'Europa', 0.000, false);
INSERT INTO public.moon VALUES (6, 5, 'Gandymede', 0.000, false);
INSERT INTO public.moon VALUES (7, 5, 'Callisto', 0.000, false);
INSERT INTO public.moon VALUES (8, 5, 'Metis', 0.000, false);
INSERT INTO public.moon VALUES (9, 5, 'Adrastea', 0.000, false);
INSERT INTO public.moon VALUES (10, 5, 'Amalthea', 0.000, false);
INSERT INTO public.moon VALUES (11, 5, 'Thebe', 0.000, false);
INSERT INTO public.moon VALUES (12, 6, 'Titan', 0.000, false);
INSERT INTO public.moon VALUES (13, 6, 'Rhea', 0.000, false);
INSERT INTO public.moon VALUES (14, 6, 'Enceladus', 0.000, false);
INSERT INTO public.moon VALUES (15, 7, 'Miranda', 0.000, false);
INSERT INTO public.moon VALUES (16, 7, 'Ariel', 0.000, false);
INSERT INTO public.moon VALUES (17, 7, 'Umbriel', 0.000, false);
INSERT INTO public.moon VALUES (18, 7, 'Titania', 0.000, false);
INSERT INTO public.moon VALUES (19, 7, 'Oberon', 0.000, false);
INSERT INTO public.moon VALUES (20, 8, 'Triton', 0.000, false);
INSERT INTO public.moon VALUES (21, 8, 'Neireid', 0.000, false);
INSERT INTO public.moon VALUES (22, 8, 'Proteus', 0.000, false);
INSERT INTO public.moon VALUES (23, 8, 'Naiad', 0.000, false);
INSERT INTO public.moon VALUES (24, 8, 'Thalassa', 0.000, false);
INSERT INTO public.moon VALUES (25, 8, 'Despina', 0.000, false);
INSERT INTO public.moon VALUES (26, 8, 'Galatea', 0.000, false);


--
-- Data for Name: planet; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.planet VALUES (1, 1, 'Mercury', 4880.000, 'First Planet', 1, false, false);
INSERT INTO public.planet VALUES (2, 1, 'Venus', 6051.000, 'Second Planet', 1, false, false);
INSERT INTO public.planet VALUES (3, 1, 'Earth', 6371.000, 'Third Planet', 1, true, true);
INSERT INTO public.planet VALUES (4, 1, 'Mars', 3389.000, 'Fourth Planet', 1, false, true);
INSERT INTO public.planet VALUES (5, 1, 'Jupiter', 69911.000, 'Fifth Planet', 2, false, false);
INSERT INTO public.planet VALUES (6, 1, 'Saturn', 58232.000, 'Sixth Planet', 2, false, false);
INSERT INTO public.planet VALUES (7, 1, 'Uranus', 25362.000, 'Seventh Planet', 2, false, false);
INSERT INTO public.planet VALUES (8, 1, 'Neptune', 24622.000, 'Eighth Planet', 2, false, false);
INSERT INTO public.planet VALUES (9, 1, 'Ceres', NULL, 'Dwarf Planet', 1, false, false);
INSERT INTO public.planet VALUES (10, 1, 'Orcus', NULL, 'Dwarf Planet', 1, false, false);
INSERT INTO public.planet VALUES (11, 1, 'Pluto', NULL, 'Dwarf Planet', 1, false, false);
INSERT INTO public.planet VALUES (12, 1, 'Haumea', NULL, 'Dwarf Planet', 1, false, false);
INSERT INTO public.planet VALUES (13, 1, 'Quaoar', NULL, 'Dwarf Planet', 1, false, false);
INSERT INTO public.planet VALUES (14, 1, 'Makemake', NULL, 'Dwarf Planet', 1, false, false);
INSERT INTO public.planet VALUES (15, 1, 'Gonggong', NULL, 'Dwarf Planet', 1, false, false);
INSERT INTO public.planet VALUES (16, 1, 'Eris', NULL, 'Dwarf Planet', 1, false, false);
INSERT INTO public.planet VALUES (17, 1, 'Sedna', NULL, 'Dwarf Planet', 1, false, false);


--
-- Data for Name: planet_types; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.planet_types VALUES ('Gaseous', 1, NULL);
INSERT INTO public.planet_types VALUES ('Rocky', 2, NULL);
INSERT INTO public.planet_types VALUES ('other', 3, NULL);


--
-- Data for Name: star; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.star VALUES (1, 1, 'Sol', 8, 696000.000, 1);
INSERT INTO public.star VALUES (2, 1, 'Rigil Kentaurus', 1, 1702200.000, 1);
INSERT INTO public.star VALUES (3, 1, 'Alpha Centauri B', 0, 1400000.000, 1);
INSERT INTO public.star VALUES (4, 1, 'Proxima Centauri', 1, 133320.000, 5);
INSERT INTO public.star VALUES (5, 1, 'Barnards Star', 0, 140000.000, 5);
INSERT INTO public.star VALUES (6, 1, 'Wolf 359', 0, 138330.000, 5);


--
-- Data for Name: star_types; Type: TABLE DATA; Schema: public; Owner: freecodecamp
--

INSERT INTO public.star_types VALUES ('Main Sequence', 1, NULL);
INSERT INTO public.star_types VALUES ('Red Giants', 2, NULL);
INSERT INTO public.star_types VALUES ('White Dwarf', 3, NULL);
INSERT INTO public.star_types VALUES ('Neutron', 4, NULL);
INSERT INTO public.star_types VALUES ('Red Dwarf', 5, NULL);
INSERT INTO public.star_types VALUES ('Brown Dwarf', 6, NULL);


--
-- Name: galaxy_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.galaxy_id_seq', 7, true);


--
-- Name: galaxy_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.galaxy_types_id_seq', 8, true);


--
-- Name: moon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.moon_id_seq', 26, true);


--
-- Name: planet_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.planet_id_seq', 17, true);


--
-- Name: planet_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.planet_types_id_seq', 35, true);


--
-- Name: star_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.star_id_seq', 6, true);


--
-- Name: star_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: freecodecamp
--

SELECT pg_catalog.setval('public.star_types_id_seq', 6, true);


--
-- Name: galaxy galaxy_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.galaxy
    ADD CONSTRAINT galaxy_name_key UNIQUE (name);


--
-- Name: galaxy galaxy_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.galaxy
    ADD CONSTRAINT galaxy_pkey PRIMARY KEY (galaxy_id);


--
-- Name: galaxy_types galaxy_types_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.galaxy_types
    ADD CONSTRAINT galaxy_types_pkey PRIMARY KEY (galaxy_types_id);


--
-- Name: moon moon_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon
    ADD CONSTRAINT moon_name_key UNIQUE (name);


--
-- Name: moon moon_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon
    ADD CONSTRAINT moon_pkey PRIMARY KEY (moon_id);


--
-- Name: planet planet_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet
    ADD CONSTRAINT planet_name_key UNIQUE (name);


--
-- Name: planet planet_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet
    ADD CONSTRAINT planet_pkey PRIMARY KEY (planet_id);


--
-- Name: planet_types planet_types_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet_types
    ADD CONSTRAINT planet_types_pkey PRIMARY KEY (planet_types_id);


--
-- Name: star star_name_key; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star
    ADD CONSTRAINT star_name_key UNIQUE (name);


--
-- Name: star star_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star
    ADD CONSTRAINT star_pkey PRIMARY KEY (star_id);


--
-- Name: star_types star_types_pkey; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star_types
    ADD CONSTRAINT star_types_pkey PRIMARY KEY (star_types_id);


--
-- Name: galaxy_types unique_galaxy_types_id; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.galaxy_types
    ADD CONSTRAINT unique_galaxy_types_id UNIQUE (galaxy_types_id);


--
-- Name: planet_types unique_planet_types_id; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet_types
    ADD CONSTRAINT unique_planet_types_id UNIQUE (planet_types_id);


--
-- Name: star_types unique_star_types_id; Type: CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star_types
    ADD CONSTRAINT unique_star_types_id UNIQUE (star_types_id);


--
-- Name: galaxy fk_galaxy_type_id; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.galaxy
    ADD CONSTRAINT fk_galaxy_type_id FOREIGN KEY (galaxy_types_id) REFERENCES public.galaxy_types(galaxy_types_id);


--
-- Name: planet fk_planet_type_id; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet
    ADD CONSTRAINT fk_planet_type_id FOREIGN KEY (planet_types_id) REFERENCES public.planet_types(planet_types_id);


--
-- Name: star fk_star_type_id; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star
    ADD CONSTRAINT fk_star_type_id FOREIGN KEY (star_types_id) REFERENCES public.star_types(star_types_id);


--
-- Name: moon moon_planet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.moon
    ADD CONSTRAINT moon_planet_id_fkey FOREIGN KEY (planet_id) REFERENCES public.planet(planet_id);


--
-- Name: planet planet_star_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.planet
    ADD CONSTRAINT planet_star_id_fkey FOREIGN KEY (star_id) REFERENCES public.star(star_id);


--
-- Name: star star_galaxy_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: freecodecamp
--

ALTER TABLE ONLY public.star
    ADD CONSTRAINT star_galaxy_id_fkey FOREIGN KEY (galaxy_id) REFERENCES public.galaxy(galaxy_id);


--
-- PostgreSQL database dump complete
--

