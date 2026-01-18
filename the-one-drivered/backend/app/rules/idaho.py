"""Idaho driver education rules."""

from app.rules.base import StateRules, register_state


IDAHO_RULES = StateRules(
    classroom_hours=30,
    btw_hours=6,
    observation_hours=6,
    min_age=14,
)

register_state("ID", IDAHO_RULES)