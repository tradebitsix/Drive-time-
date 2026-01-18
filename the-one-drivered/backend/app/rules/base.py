"""Base class for state-specific driver education rules.

Each state module should implement a subclass of `StateRules` and
register it with the rules registry below. This abstraction allows the
system to validate course and session data against the requirements
imposed by a particular state without hard-coding the rules throughout
the codebase.
"""

from dataclasses import dataclass
from typing import Dict, Type


@dataclass
class StateRules:
    """Represents rule parameters for a state's driver education program."""

    classroom_hours: int
    btw_hours: int
    observation_hours: int
    min_age: int


# Registry for state rules. Keys are uppercase state codes (e.g. "ID").
rules_registry: Dict[str, StateRules] = {}


def register_state(state_code: str, rules: StateRules) -> None:
    """Register a `StateRules` instance for a state code."""
    rules_registry[state_code.upper()] = rules


def get_rules(state_code: str) -> StateRules:
    """Retrieve rule set for the given state code.

    Raises KeyError if the state is not registered.
    """
    return rules_registry[state_code.upper()]