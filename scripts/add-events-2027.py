"""Adds the 20/12/2026 - 31/03/2027 catalogue to src/data/events.json.

Every event comes from a public source checked on 7-8 November 2026 (sourceUrl on each event):
- Football: official LaLiga club fixture pages (laliga.com/clubes/<club>/proximos-partidos).
  LaLiga lists each round on its reference Sunday; the exact day and time are set a few weeks
  before, so they are marked "por confirmar".
- EuroLeague basketball: official club schedules (realmadrid.com, fcbarcelona.com).
- Concerts: venue listings on conciertos.club / escenaensevilla.es (aggregators that link to the
  official ticket seller).
- Albacete: GlobalEntradas, the official box office of Cultural Albacete (Teatro Circo, Teatro de La Paz).
Nothing is invented: unknown data (time, price) is written as "Por confirmar" / "Consultar precio".
Run once: python scripts/add-events-2027.py (idempotent: existing events are not duplicated).
"""
import json
import re
import unicodedata
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EVENTS = ROOT / "src/data/events.json"
VENUES = {v["id"]: v for v in json.loads((ROOT / "src/data/venues.json").read_text(encoding="utf8"))}

DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]


def long_date(iso: str) -> str:
    d = date.fromisoformat(iso)
    return f"{DAYS[d.weekday()]}, {d.day} de {MONTHS[d.month - 1]} de {d.year}"


def range_date(start: str, end: str) -> str:
    a, b = date.fromisoformat(start), date.fromisoformat(end)
    if a.month == b.month:
        return f"Del {a.day} al {b.day} de {MONTHS[a.month - 1]} de {a.year}"
    return f"Del {a.day} de {MONTHS[a.month - 1]} al {b.day} de {MONTHS[b.month - 1]} de {b.year}"


def norm(text: str) -> str:
    text = unicodedata.normalize("NFD", text)
    return re.sub(r"[^a-z0-9]+", " ", "".join(c for c in text if unicodedata.category(c) != "Mn").lower()).strip()


# ---------------------------------------------------------------- football
CLUBS = {
    "Real Madrid": ("madrid-estadio-santiago-bernabeu", "https://www.laliga.com/clubes/real-madrid/proximos-partidos", "https://www.realmadrid.com/es-ES/entradas"),
    "Atlético de Madrid": ("madrid-riyadh-air-metropolitano", "https://www.laliga.com/clubes/atletico-de-madrid/proximos-partidos", "https://www.atleticodemadrid.com/entradas"),
    "Rayo Vallecano": ("madrid-estadio-de-vallecas", "https://www.laliga.com/clubes/rayo-vallecano/proximos-partidos", "https://www.laliga.com/clubes/rayo-vallecano"),
    "FC Barcelona": ("barcelona-spotify-camp-nou", "https://www.laliga.com/clubes/fc-barcelona/proximos-partidos", "https://www.fcbarcelona.com/es/entradas"),
    "Valencia CF": ("valencia-estadio-de-mestalla", "https://www.laliga.com/clubes/valencia-cf/proximos-partidos", "https://www.valenciacf.com/entradas"),
    "Sevilla FC": ("sevilla-estadio-ramon-sanchez-pizjuan", "https://www.laliga.com/clubes/sevilla-fc/proximos-partidos", "https://sevillafc.es/entradas"),
    "Real Betis": ("sevilla-estadio-la-cartuja-de-sevilla", "https://www.laliga.com/clubes/real-betis/proximos-partidos", "https://www.realbetisbalompie.es/entradas"),
    "Athletic Club": ("bilbao-san-mames", "https://www.laliga.com/clubes/athletic-club/proximos-partidos", "https://www.athletic-club.eus/entradas"),
    "Albacete Balompié": ("albacete-estadio-carlos-belmonte", "https://www.laliga.com/clubes/albacete-bp/proximos-partidos", "https://www.albacetebalompie.es"),
}
# (home, rival, LaLiga reference date, competition, confirmed kick-off or None)
MATCHES = [
    ("Real Madrid", "Getafe CF", "2027-01-03", "LaLiga", None), ("Real Madrid", "Levante UD", "2027-01-10", "LaLiga", None),
    ("Real Madrid", "LASK", "2027-01-19", "Champions League", "21:00"), ("Real Madrid", "Real Betis", "2027-01-24", "LaLiga", None),
    ("Real Madrid", "Athletic Club", "2027-02-14", "LaLiga", None), ("Real Madrid", "Valencia CF", "2027-02-28", "LaLiga", None),
    ("Real Madrid", "RCD Espanyol", "2027-03-14", "LaLiga", None),
    ("Atlético de Madrid", "Racing de Santander", "2027-01-10", "LaLiga", None), ("Atlético de Madrid", "Real Sociedad", "2027-01-17", "LaLiga", None),
    ("Atlético de Madrid", "Fenerbahçe", "2027-01-27", "Champions League", "21:00"), ("Atlético de Madrid", "RCD Espanyol", "2027-01-31", "LaLiga", None),
    ("Atlético de Madrid", "Elche CF", "2027-02-21", "LaLiga", None), ("Atlético de Madrid", "Celta", "2027-03-07", "LaLiga", None),
    ("Atlético de Madrid", "Getafe CF", "2027-03-21", "LaLiga", None),
    ("Rayo Vallecano", "Málaga CF", "2026-12-20", "LaLiga", None), ("Rayo Vallecano", "Atlético de Madrid", "2027-01-03", "LaLiga", None),
    ("Rayo Vallecano", "Sevilla FC", "2027-01-17", "LaLiga", None), ("Rayo Vallecano", "Real Madrid", "2027-01-31", "LaLiga", None),
    ("Rayo Vallecano", "Getafe CF", "2027-02-21", "LaLiga", None), ("Rayo Vallecano", "CA Osasuna", "2027-03-07", "LaLiga", None),
    ("Rayo Vallecano", "FC Barcelona", "2027-03-21", "LaLiga", None),
    ("FC Barcelona", "Real Sociedad", "2026-12-20", "LaLiga", None), ("FC Barcelona", "Elche CF", "2027-01-17", "LaLiga", None),
    ("FC Barcelona", "Como", "2027-01-27", "Champions League", "21:00"), ("FC Barcelona", "Valencia CF", "2027-01-31", "LaLiga", None),
    ("FC Barcelona", "Levante UD", "2027-02-21", "LaLiga", None), ("FC Barcelona", "Real Betis", "2027-03-07", "LaLiga", None),
    ("FC Barcelona", "RC Deportivo", "2027-03-14", "LaLiga", None),
    ("Valencia CF", "RCD Espanyol", "2026-12-20", "LaLiga", None), ("Valencia CF", "Málaga CF", "2027-01-10", "LaLiga", None),
    ("Valencia CF", "Sevilla FC", "2027-01-24", "LaLiga", None), ("Valencia CF", "Racing de Santander", "2027-02-07", "LaLiga", None),
    ("Valencia CF", "Deportivo Alavés", "2027-02-14", "LaLiga", None), ("Valencia CF", "Levante UD", "2027-03-07", "LaLiga", None),
    ("Valencia CF", "RC Deportivo", "2027-03-21", "LaLiga", None),
    ("Sevilla FC", "Racing de Santander", "2026-12-20", "LaLiga", None), ("Sevilla FC", "Celta", "2027-01-10", "LaLiga", None),
    ("Sevilla FC", "Athletic Club", "2027-01-31", "LaLiga", None), ("Sevilla FC", "RCD Espanyol", "2027-02-14", "LaLiga", None),
    ("Sevilla FC", "Real Madrid", "2027-02-21", "LaLiga", None), ("Sevilla FC", "Real Sociedad", "2027-03-07", "LaLiga", None),
    ("Sevilla FC", "Elche CF", "2027-03-21", "LaLiga", None),
    ("Real Betis", "Deportivo Alavés", "2027-01-03", "LaLiga", None), ("Real Betis", "RC Deportivo", "2027-01-17", "LaLiga", None),
    ("Real Betis", "Arsenal", "2027-01-20", "Champions League", "21:00"), ("Real Betis", "Elche CF", "2027-01-31", "LaLiga", None),
    ("Real Betis", "Sevilla FC", "2027-02-07", "LaLiga", None), ("Real Betis", "Villarreal CF", "2027-02-28", "LaLiga", None),
    ("Real Betis", "Levante UD", "2027-03-14", "LaLiga", None),
    ("Athletic Club", "Real Betis", "2026-12-20", "LaLiga", None), ("Athletic Club", "Villarreal CF", "2027-01-10", "LaLiga", None),
    ("Athletic Club", "Levante UD", "2027-01-24", "LaLiga", None), ("Athletic Club", "CA Osasuna", "2027-02-07", "LaLiga", None),
    ("Athletic Club", "Celta", "2027-02-21", "LaLiga", None), ("Athletic Club", "FC Barcelona", "2027-02-28", "LaLiga", None),
    ("Athletic Club", "Valencia CF", "2027-03-14", "LaLiga", None),
    ("Albacete Balompié", "RCD Mallorca", "2026-12-20", "LaLiga Hypermotion", None), ("Albacete Balompié", "FC Andorra", "2027-01-10", "LaLiga Hypermotion", None),
    ("Albacete Balompié", "Granada CF", "2027-01-24", "LaLiga Hypermotion", None), ("Albacete Balompié", "Real Valladolid", "2027-02-07", "LaLiga Hypermotion", None),
    ("Albacete Balompié", "CD Castellón", "2027-02-14", "LaLiga Hypermotion", None), ("Albacete Balompié", "Burgos CF", "2027-02-28", "LaLiga Hypermotion", None),
    ("Albacete Balompié", "UD Las Palmas", "2027-03-14", "LaLiga Hypermotion", None), ("Albacete Balompié", "UD Almería", "2027-03-28", "LaLiga Hypermotion", None),
]
DERBIES = {frozenset(p) for p in [("Real Madrid", "Atlético de Madrid"), ("Rayo Vallecano", "Atlético de Madrid"), ("Rayo Vallecano", "Real Madrid"),
                                  ("Real Betis", "Sevilla FC"), ("Valencia CF", "Levante UD")]}

# ---------------------------------------------------------------- basketball (EuroLeague)
BASKET = [
    ("Real Madrid Baloncesto", "Paris Basketball", "madrid-movistar-arena", "2027-02-04", "20:45", "jornada 27",
     "https://www.realmadrid.com/es-ES/noticias/baloncesto/primer-equipo/actualidad/el-calendario-del-real-madrid-para-la-euroliga-2026-27-29-07-2026"),
    ("Real Madrid Baloncesto", "Hapoel Tel Aviv", "madrid-movistar-arena", "2027-03-09", "20:45", "jornada 30",
     "https://www.realmadrid.com/es-ES/noticias/baloncesto/primer-equipo/actualidad/el-calendario-del-real-madrid-para-la-euroliga-2026-27-29-07-2026"),
    ("Real Madrid Baloncesto", "Virtus Bologna", "madrid-movistar-arena", "2027-03-11", "20:45", "jornada 31",
     "https://www.realmadrid.com/es-ES/noticias/baloncesto/primer-equipo/actualidad/el-calendario-del-real-madrid-para-la-euroliga-2026-27-29-07-2026"),
    ("Real Madrid Baloncesto", "Baskonia", "madrid-movistar-arena", "2027-03-18", "20:45", "jornada 32",
     "https://www.realmadrid.com/es-ES/noticias/baloncesto/primer-equipo/actualidad/el-calendario-del-real-madrid-para-la-euroliga-2026-27-29-07-2026"),
    ("Barça", "Real Madrid", "barcelona-palau-blaugrana", "2027-03-05", "Por confirmar", "jornada 29 · Clásico",
     "https://www.fcbarcelona.com/en/news/4549148/euroleague-schedule-for-202627/amp"),
]

# ---------------------------------------------------------------- concerts and stage
# (venue, title, start, end or None, time, category, source URL, tags)
CC = "https://conciertos.club"
GE = "https://www.globalentradas.com/globalentradas/evento"
SHOWS = [
    # Madrid · Movistar Arena
    ("madrid-movistar-arena", "Melendi", "2026-12-21", "2026-12-23", "21:00", "Música", f"{CC}/madrid/conciertos/111295-melendi/1797883200", ["Pop"]),
    ("madrid-movistar-arena", "Taburete", "2026-12-26", None, "21:00", "Música", f"{CC}/madrid/conciertos/107622-taburete", ["Pop"]),
    ("madrid-movistar-arena", "Amaral", "2026-12-28", None, "21:00", "Música", f"{CC}/madrid/conciertos/109237-amaral", ["Pop rock"]),
    ("madrid-movistar-arena", "Luli Pampín", "2027-01-04", None, "18:00", "Música", f"{CC}/madrid/conciertos/124616-luli-pampin", ["Familiar"]),
    ("madrid-movistar-arena", "Carolina Durante", "2027-01-08", None, "21:00", "Música", f"{CC}/madrid/conciertos/113313-carolina-durante", ["Indie"]),
    ("madrid-movistar-arena", "Warcry", "2027-01-09", None, "21:00", "Música", f"{CC}/madrid/conciertos/109894-warcry", ["Metal"]),
    ("madrid-movistar-arena", "Mon Laferte", "2027-01-13", None, "21:00", "Música", f"{CC}/madrid/conciertos/122409-mon-laferte", ["Latina"]),
    ("madrid-movistar-arena", "Inverfest: Niña Polaca", "2027-01-15", None, "21:00", "Música", f"{CC}/madrid/conciertos/120462-inverfest-nina-polaca", ["Indie", "Inverfest"]),
    ("madrid-movistar-arena", "Inverfest: Mikel Erentxun", "2027-01-16", None, "20:00", "Música", f"{CC}/madrid/conciertos/121652-inverfest-mikel-erentxun", ["Pop rock", "Inverfest"]),
    ("madrid-movistar-arena", "Inverfest: D. Valentino", "2027-01-22", None, "20:30", "Música", f"{CC}/madrid/conciertos/121651-inverfest-d-valentino", ["Inverfest"]),
    ("madrid-movistar-arena", "Inverfest: Barry B", "2027-01-23", None, "20:30", "Música", f"{CC}/madrid/conciertos/121650-inverfest-barry-b", ["Urbano", "Inverfest"]),
    ("madrid-movistar-arena", "Inverfest: Sidecars", "2027-01-29", None, "21:00", "Música", f"{CC}/madrid/conciertos/111209-inverfest-sidecars", ["Rock", "Inverfest"]),
    ("madrid-movistar-arena", "Inverfest: Carlos Ares", "2027-01-30", None, "19:30", "Música", f"{CC}/madrid/conciertos/121581-inverfest-carlos-ares", ["Pop", "Inverfest"]),
    ("madrid-movistar-arena", "El Barrio", "2027-02-05", None, "20:30", "Música", f"{CC}/madrid/conciertos/121645-el-barrio", ["Flamenco"]),
    ("madrid-movistar-arena", "OBK", "2027-02-18", None, "21:00", "Música", f"{CC}/madrid/conciertos/111167-obk", ["Pop"]),
    ("madrid-movistar-arena", "Alcalá Norte", "2027-02-20", None, "21:00", "Música", f"{CC}/madrid/conciertos/111491-alcala-norte", ["Rock"]),
    ("madrid-movistar-arena", "Sergio Dalma — Tour Ritorno a Via Dalma", "2027-02-21", None, "21:00", "Música", f"{CC}/madrid/conciertos/108510-tour-ritorno-a-via-dalma-sergio-dalma", ["Pop"]),
    ("madrid-movistar-arena", "Disney Worlds Collide Concert Tour", "2027-02-24", None, "19:30", "Música", f"{CC}/madrid/conciertos/121643-disney-worlds-collide-concert-tour", ["Familiar", "Bandas sonoras"]),
    ("madrid-movistar-arena", "Kase.O", "2027-02-27", None, "20:30", "Música", f"{CC}/madrid/conciertos/120757-kase-o", ["Hip hop"]),
    ("madrid-movistar-arena", "La Casa Azul", "2027-03-05", None, "20:00", "Música", f"{CC}/madrid/conciertos/121641-la-casa-azul", ["Pop"]),
    ("madrid-movistar-arena", "Siloé", "2027-03-12", "2027-03-13", "20:45", "Música", f"{CC}/madrid/conciertos/124627-siloe/1804880700", ["Indie"]),
    # Barcelona · Palau Sant Jordi
    ("barcelona-palau-sant-jordi", "Antonio Orozco", "2026-12-22", None, "20:00", "Música", f"{CC}/barcelona/conciertos/116762-antonio-orozco", ["Pop"]),
    ("barcelona-palau-sant-jordi", "Hakuna Group Music", "2027-01-09", None, "21:00", "Música", f"{CC}/barcelona/conciertos/122614-hakuna-group-music", ["Pop"]),
    ("barcelona-palau-sant-jordi", "Viva Suecia", "2027-01-16", None, "21:00", "Música", f"{CC}/barcelona/conciertos/114048-viva-suecia", ["Indie"]),
    ("barcelona-palau-sant-jordi", "Sergio Dalma — Tour Ritorno a Via Dalma", "2027-01-30", None, "21:00", "Música", f"{CC}/barcelona/conciertos/108509-tour-ritorno-a-via-dalma-sergio-dalma", ["Pop"]),
    ("barcelona-palau-sant-jordi", "aespa", "2027-01-31", None, "20:00", "Música", f"{CC}/barcelona/conciertos/117620-aespa", ["K-pop"]),
    ("barcelona-palau-sant-jordi", "La Casa Azul", "2027-03-13", None, "18:30", "Música", f"{CC}/barcelona/conciertos/115826-la-casa-azul", ["Pop"]),
    # Valencia · Roig Arena
    ("valencia-roig-arena", "Universo Makina Valencia", "2027-01-09", None, "16:00", "Música", f"{CC}/valencia/conciertos/127207-universo-makina-valencia", ["Electrónica"]),
    ("valencia-roig-arena", "OBK", "2027-01-09", None, "21:00", "Música", f"{CC}/valencia/conciertos/120951-obk", ["Pop"]),
    ("valencia-roig-arena", "Walls", "2027-01-14", "2027-01-15", "20:30", "Música", f"{CC}/valencia/conciertos/120950-walls/1799955000", ["Pop"]),
    ("valencia-roig-arena", "Sergio Dalma — Tour Ritorno a Via Dalma", "2027-01-16", None, "21:00", "Música", f"{CC}/valencia/conciertos/108518-tour-ritorno-a-via-dalma-sergio-dalma", ["Pop"]),
    ("valencia-roig-arena", "La La Love You", "2027-01-16", None, "21:00", "Música", f"{CC}/valencia/conciertos/119671-la-la-love-you", ["Indie"]),
    ("valencia-roig-arena", "Carlos Ares", "2027-01-23", None, "21:00", "Música", f"{CC}/valencia/conciertos/120949-carlos-ares", ["Pop"]),
    ("valencia-roig-arena", "Editors", "2027-01-30", None, "21:00", "Música", f"{CC}/valencia/conciertos/120719-editors", ["Rock"]),
    ("valencia-roig-arena", "Hecky", "2027-02-04", None, "20:30", "Música", f"{CC}/valencia/conciertos/120947-hecky", ["Pop"]),
    ("valencia-roig-arena", "Niña Polaca", "2027-02-05", None, "21:00", "Música", f"{CC}/valencia/conciertos/120465-nina-polaca", ["Indie"]),
    ("valencia-roig-arena", "Kase.O", "2027-02-06", None, "20:30", "Música", f"{CC}/valencia/conciertos/120750-kase-o", ["Hip hop"]),
    ("valencia-roig-arena", "Hakuna Group Music", "2027-02-13", None, "21:00", "Música", f"{CC}/valencia/conciertos/122615-hakuna-group-music", ["Pop"]),
    ("valencia-roig-arena", "Benito Kamelas", "2027-03-13", None, "21:00", "Música", f"{CC}/valencia/conciertos/120946-benito-kamelas", ["Rock"]),
    ("valencia-roig-arena", "Squeeze", "2027-03-14", None, "21:00", "Música", f"{CC}/valencia/conciertos/127015-squeeze", ["Pop rock"]),
    ("valencia-roig-arena", "Manowar", "2027-03-23", None, "21:00", "Música", f"{CC}/valencia/conciertos/120728-manowar", ["Metal"]),
    # Valencia · Palacio de Congresos and La Rambleta
    ("valencia-palacio-de-congresos", "Jeanette", "2026-12-26", None, "20:00", "Música", f"{CC}/valencia/conciertos/127385-jeanette", ["Pop"]),
    ("valencia-palacio-de-congresos", "Ara Malikian", "2026-12-27", None, "20:00", "Música", f"{CC}/valencia/conciertos/127384-ara-malikian", ["Violín"]),
    ("valencia-palacio-de-congresos", "Zimmer, Williams y 100 años de cine — Royal Film Concert Orchestra", "2026-12-28", None, "20:00", "Música", f"{CC}/valencia/conciertos/127236-zimmer-williams-y-100-anos-de-cine-royal-film-concert-orchestra", ["Bandas sonoras", "Orquesta"]),
    ("valencia-palacio-de-congresos", "Revólver", "2026-12-30", None, "20:00", "Música", f"{CC}/valencia/conciertos/127382-revolver", ["Rock"]),
    ("valencia-palacio-de-congresos", "DJ Symphonic — Royal Film Concert Orchestra", "2027-01-02", None, "17:30", "Música", f"{CC}/valencia/conciertos/124271-dj-symphonic-royal-film-concert-orchestra", ["Orquesta"]),
    ("valencia-la-rambleta", "Tanxugueiras", "2027-01-16", None, "20:00", "Música", f"{CC}/valencia/conciertos/121947-tanxugueiras", ["Folk"]),
    ("valencia-la-rambleta", "Aurum", "2027-01-22", None, "20:00", "Música", f"{CC}/valencia/conciertos/127368-aurum", ["Pop"]),
    ("valencia-la-rambleta", "Pau Vallvé", "2027-03-11", None, "20:30", "Música", f"{CC}/valencia/conciertos/121949-pau-vallve", ["Indie"]),
    # Bilbao · BEC, Euskalduna and Kafe Antzokia
    ("bilbao-bizkaia-arena-bec", "Carolina Durante", "2026-12-26", None, "21:00", "Música", f"{CC}/bilbao-bizkaia/conciertos/113312-carolina-durante", ["Indie"]),
    ("bilbao-bizkaia-arena-bec", "Peio eta Pantxoa", "2027-01-09", "2027-01-10", "Por confirmar", "Música", f"{CC}/bilbao-bizkaia/conciertos/128088-peio-eta-pantxoa/1799524800", ["Folk"]),
    ("bilbao-bizkaia-arena-bec", "Rodrigo Cuevas", "2027-01-16", None, "Por confirmar", "Música", f"{CC}/bilbao-bizkaia/conciertos/128087-rodrigo-cuevas", ["Folk"]),
    ("bilbao-euskalduna", "Fito & Fitipaldis", "2026-12-26", "2026-12-27", "21:00", "Música", f"{CC}/bilbao-bizkaia/conciertos/121827-fito-fitipaldis", ["Rock"]),
    ("bilbao-euskalduna", "Fito & Fitipaldis", "2027-01-08", "2027-01-09", "21:00", "Música", f"{CC}/bilbao-bizkaia/conciertos/121829-fito-fitipaldis", ["Rock"]),
    ("bilbao-euskalduna", "Malú", "2027-01-16", None, "21:00", "Música", f"{CC}/bilbao-bizkaia/conciertos/120635-malu", ["Pop"]),
    ("bilbao-kafe-antzokia", "Mikel Urdangarin", "2026-12-26", None, "22:00", "Música", f"{CC}/bilbao-bizkaia/conciertos/121351-mikel-urdangarin", ["Cantautor"]),
    ("bilbao-kafe-antzokia", "Peiremans", "2026-12-28", "2026-12-29", "20:00", "Música", f"{CC}/bilbao-bizkaia/conciertos/121350-peiremans/1798484400", ["Pop"]),
    ("bilbao-kafe-antzokia", "Eñaut Elorrieta", "2027-01-02", None, "22:00", "Música", f"{CC}/bilbao-bizkaia/conciertos/128100-enaut-elorrieta", ["Cantautor"]),
    ("bilbao-kafe-antzokia", "Supercremalleras", "2027-01-14", None, "21:30", "Música", f"{CC}/bilbao-bizkaia/conciertos/121334-supercremalleras", ["Rock"]),
    ("bilbao-kafe-antzokia", "Standstill", "2027-01-16", None, "21:00", "Música", f"{CC}/bilbao-bizkaia/conciertos/130121-standstill", ["Indie"]),
    ("bilbao-kafe-antzokia", "Mujeres", "2027-01-29", None, "21:00", "Música", f"{CC}/bilbao-bizkaia/conciertos/120721-mujeres", ["Indie"]),
    ("bilbao-kafe-antzokia", "Anari", "2027-02-11", None, "21:30", "Música", f"{CC}/bilbao-bizkaia/conciertos/128098-anari", ["Cantautora"]),
    ("bilbao-kafe-antzokia", "La Cabra Mecánica", "2027-02-13", None, "22:00", "Música", f"{CC}/bilbao-bizkaia/conciertos/128478-la-cabra-mecanica", ["Pop"]),
    ("bilbao-kafe-antzokia", "Ginebras", "2027-02-20", None, "21:00", "Música", f"{CC}/bilbao-bizkaia/conciertos/119662-ginebras", ["Indie"]),
    ("bilbao-kafe-antzokia", "Depedro", "2027-03-12", "2027-03-13", "21:30", "Música", f"{CC}/bilbao-bizkaia/conciertos/117218-depedro/1804883400", ["Pop"]),
    ("bilbao-kafe-antzokia", "Elliott Murphy", "2027-03-14", None, "21:00", "Música", f"{CC}/bilbao-bizkaia/conciertos/127820-elliott-murphy", ["Rock"]),
    # Sevilla · Cartuja Center CITE
    ("sevilla-cartuja-center-cite", "Mocedades y Los Panchos — 60 aniversario", "2026-12-22", None, "19:00", "Música", "https://www.escenaensevilla.es/conciertos/22203-60-aniversario-mocedades-y-los-panchos", ["Boleros"]),
    # Albacete · Cultural Albacete (official box office: GlobalEntradas)
    ("albacete-teatro-de-la-paz", "Orquesta de Guitarras de Albacete", "2026-12-20", None, "12:00", "Música", f"{GE}/concierto-de-la-orquesta-de-guitarras-de-albacete/14623", ["Clásica"]),
    ("albacete-teatro-circo", "El Cascanueces", "2026-12-20", "2026-12-22", "Varias funciones", "Danza", f"{GE}/el-cascanueces-ballet/14361", ["Ballet", "Navidad"]),
    ("albacete-teatro-circo", "Víctor Manuel — Solo a solas conmigo", "2026-12-27", None, "20:00", "Música", f"{GE}/solo-a-solas-conmigo-de-victor-manuel/14162", ["Cantautor"]),
    ("albacete-teatro-circo", "Israel Fernández", "2027-01-04", None, "20:00", "Música", f"{GE}/israel-fernandez/14635", ["Flamenco"]),
    ("albacete-teatro-circo", "Virtuosismo extremo", "2027-01-12", None, "20:00", "Música", f"{GE}/virtuosismo-extremo/14364", ["Clásica"]),
    ("albacete-teatro-circo", "FEMUBA 2027: El cangrejo en el arroyo", "2027-01-14", None, "20:00", "Música", f"{GE}/el-cangrejo-en-el-arroyo-femuba-2027/14650", ["Barroco", "FEMUBA"]),
    ("albacete-teatro-circo", "FEMUBA 2027: Per voi ardo", "2027-01-15", None, "20:00", "Música", f"{GE}/per-voi-ardo-femuba-2027/14651", ["Barroco", "FEMUBA"]),
    ("albacete-teatro-de-la-paz", "El señor Ibrahim y las flores del Corán", "2027-01-15", None, "20:00", "Teatro", f"{GE}/el-senor-ibrahim-y-las-flores-del-coran/14461", ["Drama"]),
    ("albacete-teatro-circo", "FEMUBA 2027: Primer libro de piezas de clavecín (1734)", "2027-01-16", None, "19:00", "Música", f"{GE}/primer-libro-de-piezas-de-clavecin-1734-femuba-2027/14652", ["Barroco", "FEMUBA"]),
    ("albacete-teatro-circo", "FEMUBA 2027: Don Quijote de la Mancha", "2027-01-17", None, "19:00", "Danza", f"{GE}/don-quijote-de-la-mancha-femuba-2027/14653", ["Barroco", "FEMUBA"]),
    ("albacete-teatro-circo", "Obras maestras a cuatro manos", "2027-01-20", None, "20:00", "Música", f"{GE}/obras-maestras-a-cuatro-manos/14636", ["Clásica"]),
    ("albacete-teatro-circo", "FEMUBA 2027: Francoeur à Paris", "2027-01-21", None, "20:00", "Música", f"{GE}/francoeur-a-paris-femuba-2027/14654", ["Barroco", "FEMUBA"]),
    ("albacete-teatro-circo", "FEMUBA 2027: Las Cuatro Estaciones de Vivaldi", "2027-01-22", None, "20:00", "Música", f"{GE}/las-cuatro-estaciones-antonio-vivaldi-femuba-2027/14655", ["Barroco", "FEMUBA"]),
    ("albacete-teatro-de-la-paz", "Feriantes", "2027-01-29", None, "20:00", "Teatro", f"{GE}/feriantes/14463", ["Comedia"]),
    ("albacete-teatro-circo", "Recital flamenco: Esther Merino y Niño Seve", "2027-01-30", None, "20:00", "Música", f"{GE}/recital-flamenco-a-cargo-de-esther-merino-y-nino-seve/14621", ["Flamenco"]),
    ("albacete-teatro-circo", "20 Festival Internacional de Circo de Albacete", "2027-02-04", "2027-02-20", "Varias funciones", "Teatro", f"{GE}/galas-de-estrellas-20-festival-internacional-de-circo-de-albacete/14666", ["Circo", "Festival"]),
    ("albacete-teatro-de-la-paz", "Los protagonistas de la guerra", "2027-02-12", None, "20:00", "Teatro", f"{GE}/los-protagonistas-de-la-guerra/14464", ["Drama"]),
    ("albacete-teatro-circo", "Gala Stradivarius: Orquesta de Violonchelos", "2027-02-15", None, "20:00", "Música", f"{GE}/gala-stradivarius-orquesta-de-violonchelos/14632", ["Clásica"]),
    ("albacete-teatro-de-la-paz", "Catherine Russell", "2027-03-02", None, "20:00", "Música", f"{GE}/catherine-russell/14667", ["Jazz"]),
    ("albacete-teatro-circo", "Amalur infinita — Lucía Lacarra Ballet", "2027-03-04", None, "20:00", "Danza", f"{GE}/amalur-infinita-lucia-lacarra-ballet/14647", ["Ballet"]),
    ("albacete-teatro-circo", "Aida", "2027-03-06", None, "19:00", "Ópera", f"{GE}/aida/14648", ["Verdi"]),
]

# Permanent collection: visitable every day of the period (check opening hours and holidays).
PERMANENT = [
    ("albacete-museo-de-la-cuchilleria", "Colección permanente — Museo Municipal de la Cuchillería", "https://www.museocuchilleria.es"),
]

DESCRIPTION = {
    "Música": "Concierto de {name} en {venue}.",
    "Danza": "{name} en {venue}.",
    "Teatro": "{name} en {venue}.",
    "Ópera": "{name}, ópera en {venue}.",
}


def make_event(event_id, *, category, title, start, end, time, venue_id, ticket, source, tags, organizer, description, full, confirmed=True, date_text=None, price="Consultar precio", availability="Consultar disponibilidad"):
    venue = VENUES[venue_id]
    event = {
        "id": event_id, "category": category, "title": title,
        "date": date_text or (range_date(start, end) if end and end != start else long_date(start)),
        "startDate": start, "time": time, "venueId": venue_id, "image": None, "ticketUrl": ticket,
        "duration": "Por confirmar", "price": price, "availability": availability, "organizer": organizer,
        "tags": [category, *tags], "description": description, "fullDescription": full, "confirmed": confirmed,
        "sourceUrl": source,
    }
    if end and end != start:
        event["endDate"] = end
    return event


def main():
    events = json.loads(EVENTS.read_text(encoding="utf8"))
    # Real Betis plays the 2026-27 season at La Cartuja while the Villamarín is rebuilt.
    for event in events:
        if event["venueId"] == "sevilla-estadio-benito-villamarin" and "Betis" in event["title"]:
            event["venueId"] = "sevilla-estadio-la-cartuja-de-sevilla"
            event["fullDescription"] = event["fullDescription"].replace("Estadio Benito Villamarín", "Estadio de La Cartuja").replace("Benito Villamarín", "La Cartuja")
            event["description"] = event["description"].replace("Benito Villamarín", "La Cartuja")
    next_id = max(e["id"] for e in events) + 1

    def exists(venue_id, start, words):
        target = date.fromisoformat(start)
        for e in events:
            if e["venueId"] != venue_id or not e.get("startDate"):
                continue
            if abs((date.fromisoformat(e["startDate"]) - target).days) > 2:
                continue
            if all(w in norm(e["title"]) for w in words):
                return True
        return False

    added = 0
    for home, rival, ref, comp, kickoff in MATCHES:
        venue_id, source, ticket = CLUBS[home]
        if exists(venue_id, ref, norm(rival).split()[:1]):
            continue
        derby = frozenset((home, rival)) in DERBIES
        title = f"{home} vs {rival} — {comp}"
        if kickoff:
            date_text, time = long_date(ref), kickoff
        else:
            d = date.fromisoformat(ref)
            date_text, time = f"Jornada del fin de semana del {(d - timedelta(days=1)).day}-{d.day} de {MONTHS[d.month - 1]} de {d.year} (día por confirmar)", "Por confirmar"
        venue = VENUES[venue_id]
        events.append(make_event(
            next_id, category="Deportes", title=title, start=ref, end=None, time=time, venue_id=venue_id, ticket=ticket, source=source,
            tags=["Fútbol", comp, *(["Derbi"] if derby else [])], organizer=home,
            description=f"{home} recibe a {rival} en {venue['name']}{' en un derbi' if derby else ''}.",
            full=f"Partido de {comp} entre {home} y {rival} en {venue['name']}. {'Fecha y hora oficiales.' if kickoff else 'LaLiga fija el día exacto y la hora unas semanas antes; consulta la web del club.'} Fuente: calendario oficial publicado en laliga.com.",
            date_text=date_text,
        ))
        next_id += 1
        added += 1

    for home, rival, venue_id, start, time, rnd, source in BASKET:
        if exists(venue_id, start, norm(rival).split()[:1]):
            continue
        venue = VENUES[venue_id]
        events.append(make_event(
            next_id, category="Deportes", title=f"{home} vs {rival} — EuroLeague, {rnd}", start=start, end=None, time=time, venue_id=venue_id,
            ticket=venue.get("websiteUrl") or source, source=source, tags=["Baloncesto", "EuroLeague"], organizer=home,
            description=f"{home} recibe a {rival} en {venue['name']} ({rnd} de la EuroLeague).",
            full=f"Partido de la EuroLeague 2026-27 entre {home} y {rival} en {venue['name']}. Fuente: calendario oficial publicado por el club.",
        ))
        next_id += 1
        added += 1

    for venue_id, title, start, end, time, category, source, tags in SHOWS:
        name = title.split(" — ")[0]
        if exists(venue_id, start, norm(name).split()[:2]):
            continue
        venue = VENUES[venue_id]
        when = range_date(start, end) if end else long_date(start).lower()
        is_albacete = source.startswith(GE)
        events.append(make_event(
            next_id, category=category, title=title, start=start, end=end, time=time, venue_id=venue_id, ticket=source, source=source, tags=tags,
            organizer="Cultural Albacete" if is_albacete else "Consultar en la web de venta",
            description=DESCRIPTION[category].format(name=title, venue=venue["name"]),
            full=f"{title} en {venue['name']} ({venue['city']}), {when}. Comprueba horarios, precios y disponibilidad en la web de venta enlazada.",
        ))
        next_id += 1
        added += 1

    for venue_id, title, source in PERMANENT:
        if any(e["venueId"] == venue_id and e["title"] == title for e in events):
            continue
        venue = VENUES[venue_id]
        events.append(make_event(
            next_id, category="Museos", title=title, start="2026-12-01", end="2027-12-31", time="Horario del museo", venue_id=venue_id,
            ticket=source, source=source, tags=["Colección permanente"], organizer=venue["name"],
            description=f"Visita la colección permanente del {venue['name']}.",
            full=f"La colección permanente del {venue['name']} se puede visitar todo el año. Consulta horarios, festivos y tarifas en su web.",
            date_text="Abierto todo el año (consulta horarios y festivos)", availability="Visita disponible",
        ))
        next_id += 1
        added += 1

    # Every event keeps a link to where its data came from. Pictures are added afterwards by
    # scripts/fetch-event-images.mjs (poster or artist photo; the venue photo is the last resort).
    for event in events:
        event.setdefault("sourceUrl", event.get("ticketUrl"))

    EVENTS.write_text(json.dumps(events, indent=2, ensure_ascii=False) + "\n", encoding="utf8")
    print(f"Added {added} events; total {len(events)}")


if __name__ == "__main__":
    main()
