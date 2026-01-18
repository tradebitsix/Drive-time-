"""Montana driver education rules."""

from app.rules.base import StateRules, register_state


MONTANA_RULES = StateRules(
    classroom_hours=30,
    btw_hours=6,
    observation_hours=6,
    min_age=14,
)

register_state("MT", MONTANA_RULES)