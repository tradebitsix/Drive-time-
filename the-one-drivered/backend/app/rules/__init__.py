"""Rules package initializer.

Importing this package automatically registers state rules defined in
submodules. This ensures that the registry is populated on startup.
"""

# Import state modules to register them. Each module will invoke
# register_state on import.
from . import idaho, montana, wyoming  # noqa: F401

from .base import get_rules, register_state, rules_registry, StateRules  # noqa: F401