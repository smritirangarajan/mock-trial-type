# Mock Trial Type 🐵⚖️

A typing practice application specifically designed for mock trial students and attorneys to master the Federal Rules of Evidence through interactive typing exercises.

## Overview

Mock Trial Type combines the proven effectiveness of typing practice apps like MonkeyType with specialized content from legal evidence rules. Instead of typing random words or generic passages, users practice typing actual Federal Rules of Evidence, helping them simultaneously improve their typing speed and memorize crucial legal concepts.

## Features

### 🎯 **Targeted Legal Content**
- Complete Federal Rules of Evidence database
- Organized by rule numbers (804, 805, 806, 901, 902, 903, 1002)
- Structured content broken down into logical sections for better learning

### ⚡ **Typing Practice Features**
- Real-time WPM (Words Per Minute) tracking
- Accuracy measurement
- Progress tracking over time
- Multiple difficulty levels based on rule complexity

### 📚 **Educational Benefits**
- Learn evidence rules through repetition
- Improve legal terminology familiarity
- Build muscle memory for common legal phrases
- Perfect for law students, mock trial participants, and legal professionals

## Technology Stack

- **Frontend**: React.js
- **Data Processing**: Jupyter Notebook (Python)
- **Data Format**: JSON


## Data Processing Pipeline

The legal rules content was processed using a Jupyter Notebook workflow:

1. **Raw Data Extraction**: Federal Rules of Evidence extracted from official sources
2. **Data Cleaning**: Removed formatting inconsistencies and standardized structure
3. **JSON Generation**: Converted cleaned data into structured JSON format
4. **Content Organization**: Broke down long rule sections into logical, typable chunks

### JSON Structure

The rules are organized in a hierarchical JSON structure:

```json
{
  "id": "804",
  "title": "Rule 804. Exceptions to the Rule Against Hearsay",
  "text": {
    "a": "Main rule text...",
    "a1": "(1) First subsection...",
    "a2": "(2) Second subsection...",
    "b": "Next major section...",
    "b1": "(1) First subsection of B..."
  }
}
```

This structure allows for:
- Granular practice sessions (practice individual subsections)
- Progressive difficulty (start with main rules, advance to subsections)
- Logical content grouping for educational purposes

## Installation & Setup

```bash
# Clone the repository
git clone https://github.com/smritirangarajan/mock-trial-type

# Navigate to project directory
cd my-app

# Install dependencies
npm install

# Start development server
npm start
```

## Usage

1. **Select a Rule**: Choose from available Federal Rules of Evidence
2. **Choose Difficulty**: 
   - Beginner: Main rule text only
   - Intermediate: Include major subsections
   - Advanced: Complete rule with all subsections
3. **Start Typing**: Type the displayed rule text as accurately and quickly as possible
4. **Track Progress**: Monitor your WPM, accuracy, and improvement over time

## Educational Applications

### For Law Students
- Memorize evidence rules through repetition
- Improve legal writing speed
- Build familiarity with legal terminology

### For Mock Trial Teams
- Practice typing common objections and rule citations
- Improve speed in legal research and brief writing
- Build confidence with evidence rule knowledge

## Data Source:

https://www.collegemocktrial.org/Rules%20of%20Evidence%20-%20Revised%20Sept%202%202021.pdf


## Acknowledgments

- Inspired by MonkeyType and similar typing practice applications
- Built for the mock trial and legal education community
---

**Note**: This application is designed for educational purposes. Always consult official legal sources and qualified attorneys for authoritative rule interpretation and legal advice.
