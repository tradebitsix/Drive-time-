"""Wyoming driver education rules."""

from app.rules.base import StateRules, register_state


WYOMING_RULES = StateRules(
    classroom_hours=30,
    btw_hours=6,
    observation_hours=6,
    min_age=15,
)

register_state("WY", WYOMING_RULES)