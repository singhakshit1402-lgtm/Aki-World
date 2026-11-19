export interface DataAnalyticsProject {
  readonly id: string;
  readonly number: number;
  readonly slug: string;
  readonly title: string;
  readonly filename: string;
  readonly badge: string;
  readonly shortDesc: string;
  readonly customMessage: string;
  readonly libraries: readonly string[];
  readonly csvOutput: string;
  readonly keyMetrics: readonly string[];
  readonly chartTypes: readonly string[];
  readonly keywords: readonly string[];
  readonly code: string;
}

export const DATA_ANALYTICS_PREREQ_CMD = 'pip install pandas numpy matplotlib seaborn';

export const DATA_ANALYTICS_PROJECTS: readonly DataAnalyticsProject[] = [
  {
    id: 'budget-tracker',
    number: 1,
    slug: 'budget-tracker',
    title: 'Budget Tracker',
    filename: 'project1_budget_tracker.py',
    badge: '💰 Project 01',
    shortDesc: 'Tracks monthly income vs category-wise expenses, net savings, savings rate %, and spending distribution.',
    customMessage:
      '🔥 Boss ikA Special — Project 1 (Budget Tracker) Ready! Yeh script khud budget_data.csv banayegi, Total Income vs Expenses aur Savings % nikalegi, aur Bar + Pie Chart plot karegi. Bas Copy Code dabao aur VS Code me run karo!',
    libraries: ['pandas', 'matplotlib'],
    csvOutput: 'budget_data.csv',
    keyMetrics: ['Total Income', 'Total Expenses', 'Net Savings & Savings Rate (%)', 'Category-wise Spend'],
    chartTypes: ['Category Expense Bar Chart', 'Expense Share Pie Chart'],
    keywords: [
      'budget tracker',
      'budget_tracker',
      'budget_data',
      'project 1',
      'project1',
      'hcl 1',
      'p1',
      'monthly income',
      'expense tracker',
      'income expense',
      'savings rate',
      'kharcha',
      'budget project',
    ],
    code: `import pandas as pd
import matplotlib.pyplot as plt

# 1. Create / Load Dataset
data = {
    "Month": ["Jan", "Jan", "Jan", "Jan", "Jan", "Feb", "Feb", "Feb", "Feb", "Feb"],
    "Category": [
        "Income", "Rent", "Food", "Transport", "Entertainment",
        "Income", "Rent", "Food", "Transport", "Entertainment"
    ],
    "Type": [
        "Credit", "Debit", "Debit", "Debit", "Debit",
        "Credit", "Debit", "Debit", "Debit", "Debit"
    ],
    "Amount": [45000, 12000, 8500, 3200, 4000, 45000, 12000, 7800, 2900, 5200]
}
df = pd.DataFrame(data)
df.to_csv("budget_data.csv", index=False)

# 2. Data Analysis (EDA)
total_income = df[df["Type"] == "Credit"]["Amount"].sum()
expenses_df = df[df["Type"] == "Debit"]
total_expense = expenses_df["Amount"].sum()
net_savings = total_income - total_expense
savings_rate = (net_savings / total_income) * 100 if total_income > 0 else 0.0

print("=== BUDGET TRACKER SUMMARY ===")
print(f"Total Income   : Rs. {total_income:,.2f}")
print(f"Total Expenses : Rs. {total_expense:,.2f}")
print(f"Net Savings    : Rs. {net_savings:,.2f} ({savings_rate:.2f}%)")

category_spend = expenses_df.groupby("Category")["Amount"].sum().sort_values(ascending=False)
print("\\nCategory-wise Expenses:\\n", category_spend)

# 3. Visualization
plt.figure(figsize=(10, 4))

plt.subplot(1, 2, 1)
category_spend.plot(kind="bar", color="teal", edgecolor="black")
plt.title("Expenses by Category")
plt.ylabel("Amount (Rs.)")
plt.xticks(rotation=30)

plt.subplot(1, 2, 2)
plt.pie(category_spend, labels=category_spend.index, autopct="%1.1f%%", startangle=140)
plt.title("Expense Share")

plt.tight_layout()
plt.show()
`,
  },
  {
    id: 'ecommerce-dashboard',
    number: 2,
    slug: 'ecommerce-dashboard',
    title: 'E-commerce Dashboard',
    filename: 'project2_ecommerce_dashboard.py',
    badge: '🛒 Project 02',
    shortDesc: 'Evaluates regional revenue, profit margins, average order value (AOV), and category performance.',
    customMessage:
      '🛒 Project 2 (E-commerce Dashboard) Ready! Isme 200 synthetic orders ecommerce_data.csv me auto-generate hote hain, Total Revenue, Profit, Average Order Value (AOV), Category Sales vs Profit aur Regional Revenue Share plot hota hai!',
    libraries: ['pandas', 'numpy', 'matplotlib'],
    csvOutput: 'ecommerce_data.csv',
    keyMetrics: ['Total Revenue', 'Total Profit', 'Average Order Value (AOV)', 'Sales & Profit by Category'],
    chartTypes: ['Sales vs Profit Grouped Bar Chart', 'Regional Revenue Pie Chart'],
    keywords: [
      'ecommerce dashboard',
      'e-commerce dashboard',
      'e commerce dashboard',
      'ecommerce',
      'e-commerce',
      'e commerce',
      'ecommerce_data',
      'project 2',
      'project2',
      'hcl 2',
      'p2',
      'aov',
      'average order value',
      'regional revenue',
      'sales dashboard',
    ],
    code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# 1. Generate Synthetic E-commerce Dataset
n = 200
df = pd.DataFrame({
    "Order_ID": range(1001, 1001 + n),
    "Month": np.random.choice(["Jan", "Feb", "Mar", "Apr", "May", "Jun"], n),
    "Region": np.random.choice(["North", "South", "East", "West"], n),
    "Category": np.random.choice(["Electronics", "Clothing", "Home & Kitchen", "Books"], n),
    "Sales": np.random.randint(500, 15000, n),
    "Quantity": np.random.randint(1, 6, n)
})
df["Profit"] = (df["Sales"] * np.random.uniform(0.10, 0.35, n)).round(2)
df.to_csv("ecommerce_data.csv", index=False)

# 2. KPI Calculations
total_sales = df["Sales"].sum()
total_profit = df["Profit"].sum()
aov = df["Sales"].mean()

print("=== E-COMMERCE DASHBOARD KPIs ===")
print(f"Total Revenue : Rs. {total_sales:,.2f}")
print(f"Total Profit  : Rs. {total_profit:,.2f}")
print(f"Avg Order Val : Rs. {aov:,.2f}")
print("\\nSales & Profit by Category:\\n", df.groupby("Category")[["Sales", "Profit"]].sum())

# 3. Dashboard Plots
fig, axes = plt.subplots(1, 2, figsize=(12, 4))

cat_summary = df.groupby("Category")[["Sales", "Profit"]].sum()
cat_summary.plot(kind="bar", ax=axes[0], color=["royalblue", "limegreen"])
axes[0].set_title("Sales vs Profit by Category")
axes[0].set_ylabel("Amount (Rs.)")
axes[0].tick_params(axis="x", rotation=25)

region_sales = df.groupby("Region")["Sales"].sum()
axes[1].pie(region_sales, labels=region_sales.index, autopct="%1.1f%%", startangle=90)
axes[1].set_title("Revenue Share by Region")

plt.tight_layout()
plt.show()
`,
  },
  {
    id: 'ipl-analysis',
    number: 3,
    slug: 'ipl-analysis',
    title: 'IPL Match Analysis',
    filename: 'project3_ipl_analysis.py',
    badge: '🏏 Project 03',
    shortDesc: 'Analyzes team win counts, toss decisions (Bat vs Field), and toss-to-match win conversion rate.',
    customMessage:
      '🏏 Project 3 (IPL Match Analysis) Ready! 120 IPL matches (CSK, MI, RCB, KKR, RR, SRH) ko ipl_matches.csv me save karta hai, Toss Impact % calculate karta hai, aur Seaborn me Team Wins + Toss Decision charts plot karta hai!',
    libraries: ['pandas', 'numpy', 'seaborn', 'matplotlib'],
    csvOutput: 'ipl_matches.csv',
    keyMetrics: ['Toss Winner = Match Winner %', 'Most Successful Teams', 'Bat vs Field Toss Split'],
    chartTypes: ['Team Wins Countplot', 'Toss Decision vs Match Win Grouped Countplot'],
    keywords: [
      'ipl match analysis',
      'ipl analysis',
      'ipl_matches',
      'ipl project',
      'toss decision',
      'project 3',
      'project3',
      'hcl 3',
      'p3',
      'cricket data analytics',
    ],
    code: `import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

np.random.seed(10)

# 1. Generate IPL Match Dataset
teams = ["CSK", "MI", "RCB", "KKR", "RR", "SRH"]
n_matches = 120
toss_winners = np.random.choice(teams, n_matches)
match_winners = [
    tw if np.random.rand() < 0.55 else np.random.choice([t for t in teams if t != tw])
    for tw in toss_winners
]

df = pd.DataFrame({
    "Match_ID": range(1, n_matches + 1),
    "Toss_Winner": toss_winners,
    "Toss_Decision": np.random.choice(["Field", "Bat"], n_matches, p=[0.65, 0.35]),
    "Match_Winner": match_winners,
    "Top_Scorer_Runs": np.random.randint(45, 115, n_matches)
})
df.to_csv("ipl_matches.csv", index=False)

# 2. Analysis
df["Toss_Win_Is_Match_Win"] = df["Toss_Winner"] == df["Match_Winner"]
toss_impact = df["Toss_Win_Is_Match_Win"].mean() * 100

print("=== IPL MATCH ANALYSIS ===")
print(f"Toss Winner also Won Match: {toss_impact:.1f}% of games")
print("\\nMost Successful Teams (Wins):\\n", df["Match_Winner"].value_counts())

# 3. Visualization
plt.figure(figsize=(10, 4))

plt.subplot(1, 2, 1)
order = df["Match_Winner"].value_counts().index
sns.countplot(data=df, x="Match_Winner", hue="Match_Winner", order=order, palette="viridis", legend=False)
plt.title("Total Match Wins by Team")

plt.subplot(1, 2, 2)
sns.countplot(data=df, x="Toss_Decision", hue="Toss_Win_Is_Match_Win", palette="Set2")
plt.title("Toss Decision vs Match Win")

plt.tight_layout()
plt.show()
`,
  },
  {
    id: 'food-delivery',
    number: 4,
    slug: 'food-delivery',
    title: 'Food Delivery Order Analysis',
    filename: 'project4_food_delivery.py',
    badge: '🍔 Project 04',
    shortDesc: 'Examines peak-hour delivery delays, popular cuisines, order values, and customer rating trends.',
    customMessage:
      '🍔 Project 4 (Food Delivery Order Analysis) Ready! 150 Zomato/Swiggy style orders ko food_delivery.csv me generate karta hai, Peak vs Non-Peak delivery delays & cuisine ratings analyze karta hai aur Boxplot + Scatterplot banata hai!',
    libraries: ['pandas', 'numpy', 'seaborn', 'matplotlib'],
    csvOutput: 'food_delivery.csv',
    keyMetrics: ['Avg Delivery Time (Peak vs Non-Peak)', 'Cuisine Order Value & Rating', 'Delay vs Rating Correlation'],
    chartTypes: ['Peak vs Non-Peak Delivery Boxplot', 'Delivery Time vs Customer Rating Scatterplot'],
    keywords: [
      'food delivery',
      'food delivery order analysis',
      'food_delivery',
      'delivery analysis',
      'peak hour delivery',
      'zomato analysis',
      'swiggy analysis',
      'project 4',
      'project4',
      'hcl 4',
      'p4',
    ],
    code: `import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

np.random.seed(21)

# 1. Generate Dataset
n = 150
peak = np.random.choice(["Yes", "No"], n, p=[0.6, 0.4])
delivery_time = [np.random.randint(35, 65) if p == "Yes" else np.random.randint(18, 40) for p in peak]
ratings = [round(max(1.0, 5.0 - (dt - 20) * 0.06 + np.random.normal(0, 0.3)), 1) for dt in delivery_time]

df = pd.DataFrame({
    "Order_ID": range(501, 501 + n),
    "Cuisine": np.random.choice(["North Indian", "Chinese", "Fast Food", "South Indian", "Desserts"], n),
    "Order_Value": np.random.randint(150, 1200, n),
    "Peak_Hour": peak,
    "Delivery_Time_Min": delivery_time,
    "Customer_Rating": np.clip(ratings, 1.0, 5.0)
})
df.to_csv("food_delivery.csv", index=False)

# 2. Analysis
print("=== FOOD DELIVERY ORDER ANALYSIS ===")
print("Avg Delivery Time (Peak vs Non-Peak):\\n", df.groupby("Peak_Hour")["Delivery_Time_Min"].mean().round(2))
print("\\nCuisine Order Value & Avg Rating:\\n", df.groupby("Cuisine")[["Order_Value", "Customer_Rating"]].mean().round(2))

# 3. Visualization
plt.figure(figsize=(10, 4))

plt.subplot(1, 2, 1)
sns.boxplot(data=df, x="Peak_Hour", y="Delivery_Time_Min", hue="Peak_Hour", palette="coolwarm", legend=False)
plt.title("Delivery Time: Peak vs Non-Peak")

plt.subplot(1, 2, 2)
sns.scatterplot(data=df, x="Delivery_Time_Min", y="Customer_Rating", hue="Peak_Hour")
plt.title("Delivery Time vs Customer Rating")

plt.tight_layout()
plt.show()
`,
  },
  {
    id: 'spotify-catalogue',
    number: 5,
    slug: 'spotify-catalogue',
    title: 'Spotify Catalogue Analysis',
    filename: 'project5_spotify_catalogue.py',
    badge: '🎧 Project 05',
    shortDesc: 'Explores audio attributes (danceability, energy, tempo BPM) and stream counts across genres.',
    customMessage:
      '🎧 Project 5 (Spotify Catalogue Analysis) Ready! 150 tracks ko spotify_catalogue.csv me generate karta hai, Genre-wise Average Streams (Millions), Danceability & Energy analyze karta hai aur Horizontal Bar + Bubble Scatterplot plot karta hai!',
    libraries: ['pandas', 'numpy', 'seaborn', 'matplotlib'],
    csvOutput: 'spotify_catalogue.csv',
    keyMetrics: ['Avg Streams (Millions) by Genre', 'Danceability & Energy Profiles', 'Tempo (BPM) Distribution'],
    chartTypes: ['Genre Average Streams Horizontal Bar Chart', 'Danceability vs Energy Bubble Plot'],
    keywords: [
      'spotify catalogue',
      'spotify catalog',
      'spotify analysis',
      'spotify_catalogue',
      'spotify project',
      'spotify',
      'danceability',
      'project 5',
      'project5',
      'hcl 5',
      'p5',
    ],
    code: `import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

np.random.seed(33)

# 1. Generate Spotify Track Dataset
n = 150
df = pd.DataFrame({
    "Track_ID": range(1, n + 1),
    "Genre": np.random.choice(["Pop", "Hip-Hop", "Indie", "EDM", "Lo-Fi"], n),
    "Tempo_BPM": np.random.randint(75, 160, n),
    "Danceability": np.round(np.random.uniform(0.3, 0.95, n), 2),
    "Energy": np.round(np.random.uniform(0.2, 0.98, n), 2),
    "Streams_Millions": np.round(np.random.exponential(scale=45, size=n) + 5, 2)
})
df.to_csv("spotify_catalogue.csv", index=False)

# 2. Analysis
print("=== SPOTIFY CATALOGUE INSIGHTS ===")
print("Genre Summary (Avg Streams & Audio Features):")
print(df.groupby("Genre")[["Streams_Millions", "Danceability", "Energy"]].mean().round(2))

# 3. Visualization
plt.figure(figsize=(10, 4))

plt.subplot(1, 2, 1)
df.groupby("Genre")["Streams_Millions"].mean().sort_values().plot(kind="barh", color="mediumseagreen")
plt.title("Average Streams (Millions) by Genre")
plt.xlabel("Streams (M)")

plt.subplot(1, 2, 2)
sns.scatterplot(data=df, x="Danceability", y="Energy", hue="Genre", size="Streams_Millions", sizes=(20, 150))
plt.title("Danceability vs Energy by Genre")

plt.tight_layout()
plt.show()
`,
  },
  {
    id: 'student-performance',
    number: 6,
    slug: 'student-performance',
    title: 'Student Performance and Attendance Analysis',
    filename: 'project6_student_performance.py',
    badge: '🎓 Project 06',
    shortDesc: 'Correlates attendance % and study hours with final marks and flags students below the 75% threshold.',
    customMessage:
      '🎓 Project 6 (Student Performance & Attendance Analysis) — Specially customized with CSE-2 IDs (CSE2_001..080)! Saves student_performance.csv, calculates Attendance vs Marks correlation, flags <75% shortages, and plots the red 75% cutoff line!',
    libraries: ['pandas', 'numpy', 'seaborn', 'matplotlib'],
    csvOutput: 'student_performance.csv',
    keyMetrics: ['Attendance vs Marks Correlation', 'Students Below 75% Shortage Count', 'Avg Marks by Attendance Status'],
    chartTypes: ['Attendance % vs Final Marks Scatterplot with 75% Cutoff Line'],
    keywords: [
      'student performance',
      'attendance analysis',
      'student_performance',
      'student performance and attendance',
      '75% attendance project',
      'project 6',
      'project6',
      'hcl 6',
      'p6',
    ],
    code: `import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

np.random.seed(7)

# 1. Generate Student Dataset
n = 80
attendance = np.random.uniform(50, 98, n).round(1)
study_hours = np.random.uniform(1.0, 6.0, n).round(1)
final_marks = np.clip((attendance * 0.55 + study_hours * 7.5 + np.random.normal(0, 5, n)), 25, 100).round(1)

df = pd.DataFrame({
    "Student_ID": [f"CSE2_{i:03d}" for i in range(1, n + 1)],
    "Attendance_Pct": attendance,
    "Study_Hours_Daily": study_hours,
    "Final_Marks": final_marks
})
df["Attendance_Status"] = np.where(df["Attendance_Pct"] < 75, "Shortage (<75%)", "Safe (>=75%)")
df.to_csv("student_performance.csv", index=False)

# 2. Analysis
corr = df["Attendance_Pct"].corr(df["Final_Marks"])
shortage_count = (df["Attendance_Pct"] < 75).sum()

print("=== STUDENT PERFORMANCE & ATTENDANCE ANALYSIS ===")
print(f"Correlation (Attendance vs Marks): {corr:.2f}")
print(f"Students Below 75% Attendance    : {shortage_count} out of {n}")
print("\\nAverage Marks by Attendance Status:\\n", df.groupby("Attendance_Status")["Final_Marks"].mean().round(2))

# 3. Visualization
plt.figure(figsize=(8, 4.5))
sns.scatterplot(data=df, x="Attendance_Pct", y="Final_Marks", hue="Attendance_Status", s=70)
plt.axvline(75, color="red", linestyle="--", label="75% Threshold")
plt.title("Student Attendance % vs Final Marks")
plt.legend()
plt.tight_layout()
plt.show()
`,
  },
  {
    id: 'ott-ratings',
    number: 7,
    slug: 'ott-ratings',
    title: 'OTT Rating Analysis',
    filename: 'project7_ott_ratings.py',
    badge: '📺 Project 07',
    shortDesc: 'Compares IMDb ratings, Movies vs Web Series split, and genre counts across OTT streaming platforms.',
    customMessage:
      '📺 Project 7 (OTT Rating Analysis) Ready! Netflix, Prime Video, Disney+ Hotstar aur JioCinema ke 180 titles ka dataset ott_ratings.csv me banata hai aur IMDb Ratings Boxplot + Genre Countplot dikhata hai!',
    libraries: ['pandas', 'numpy', 'seaborn', 'matplotlib'],
    csvOutput: 'ott_ratings.csv',
    keyMetrics: ['Avg IMDb Rating by Platform', 'Movies vs Web Series Split', 'Genre Distribution'],
    chartTypes: ['Platform IMDb Rating Boxplot', 'Genre Movies vs Web Series Countplot'],
    keywords: [
      'ott rating',
      'ott ratings',
      'ott analysis',
      'ott_ratings',
      'netflix analysis',
      'imdb analysis',
      'streaming analysis',
      'project 7',
      'project7',
      'hcl 7',
      'p7',
    ],
    code: `import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

np.random.seed(55)

# 1. Generate OTT Dataset
n = 180
df = pd.DataFrame({
    "Title_ID": range(1, n + 1),
    "Platform": np.random.choice(["Netflix", "Prime Video", "Disney+ Hotstar", "JioCinema"], n),
    "Content_Type": np.random.choice(["Movie", "Web Series"], n, p=[0.6, 0.4]),
    "Genre": np.random.choice(["Thriller", "Drama", "Sci-Fi", "Comedy", "Action"], n),
    "IMDb_Rating": np.round(np.random.normal(7.1, 1.1, n).clip(3.5, 9.6), 1)
})
df.to_csv("ott_ratings.csv", index=False)

# 2. Analysis
print("=== OTT PLATFORM & RATING ANALYSIS ===")
print("Average IMDb Rating by Platform:\\n", df.groupby("Platform")["IMDb_Rating"].mean().round(2))
print("\\nContent Type Split:\\n", df["Content_Type"].value_counts())

# 3. Visualization
plt.figure(figsize=(10, 4))

plt.subplot(1, 2, 1)
sns.boxplot(data=df, x="Platform", y="IMDb_Rating", hue="Platform", palette="pastel", legend=False)
plt.title("IMDb Ratings Distribution by Platform")
plt.xticks(rotation=20)

plt.subplot(1, 2, 2)
sns.countplot(data=df, x="Genre", hue="Content_Type", palette="magma")
plt.title("Genre Count: Movies vs Web Series")
plt.xticks(rotation=20)

plt.tight_layout()
plt.show()
`,
  },
  {
    id: 'weather-trends',
    number: 8,
    slug: 'weather-trends',
    title: 'Weather Trend Analysis',
    filename: 'project8_weather_trends.py',
    badge: '🌦️ Project 08',
    shortDesc: 'Processes 90-day temperature, humidity & rainfall time-series data with a 7-day rolling average curve.',
    customMessage:
      '🌦️ Project 8 (Weather Trend Analysis) Ready! 90 days ka time-series weather dataset weather_trends.csv me save karta hai, Max/Min Temp, Total Rainfall & Correlation print karta hai, aur smooth 7-Day Moving Average curve plot karta hai!',
    libraries: ['pandas', 'numpy', 'matplotlib'],
    csvOutput: 'weather_trends.csv',
    keyMetrics: ['Max & Min Temperature (C)', 'Total Rainfall (mm)', 'Temp-Humidity Correlation', '7-Day Rolling Average'],
    chartTypes: ['Daily Temperature & 7-Day Moving Average Line Chart'],
    keywords: [
      'weather trend',
      'weather trends',
      'weather analysis',
      'weather_trends',
      'temperature trend',
      'rolling average',
      'rainfall analysis',
      'project 8',
      'project8',
      'hcl 8',
      'p8',
    ],
    code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(99)

# 1. Generate 90-Day Weather Dataset
dates = pd.date_range(start="2026-06-01", periods=90, freq="D")
temp = 32 + 5 * np.sin(np.linspace(0, 3 * np.pi, 90)) + np.random.normal(0, 1.8, 90)
humidity = np.clip(100 - temp * 1.4 + np.random.normal(0, 6, 90), 30, 98)
rainfall = np.random.choice([0, 0, 0, 5, 12, 25, 45], size=90)

df = pd.DataFrame({
    "Date": dates,
    "Temp_C": temp.round(1),
    "Humidity_Pct": humidity.round(1),
    "Rainfall_mm": rainfall
})
df["Temp_7Day_Avg"] = df["Temp_C"].rolling(window=7).mean()
df.to_csv("weather_trends.csv", index=False)

# 2. Analysis
print("=== WEATHER TREND ANALYSIS ===")
print(f"Max Temperature : {df['Temp_C'].max()} C")
print(f"Min Temperature : {df['Temp_C'].min()} C")
print(f"Total Rainfall  : {df['Rainfall_mm'].sum()} mm")
print(f"Temp-Humidity Correlation: {df['Temp_C'].corr(df['Humidity_Pct']):.2f}")

# 3. Visualization
plt.figure(figsize=(10, 4))
plt.plot(df["Date"], df["Temp_C"], label="Daily Temp (C)", alpha=0.5, color="orange")
plt.plot(df["Date"], df["Temp_7Day_Avg"], label="7-Day Moving Avg", color="red", linewidth=2)
plt.title("Daily Temperature Trend & 7-Day Rolling Average")
plt.xlabel("Date")
plt.ylabel("Temperature (C)")
plt.xticks(rotation=30)
plt.legend()
plt.tight_layout()
plt.show()
`,
  },
  {
    id: 'customer-segmentation',
    number: 9,
    slug: 'customer-segmentation',
    title: 'Customer Segmentation Analysis',
    filename: 'project9_customer_segmentation.py',
    badge: '👥 Project 09',
    shortDesc: 'Segments customers into VIP Target, Careful High-Earner, Impulse Buyer & Budget Customer groups.',
    customMessage:
      '👥 Project 9 (Customer Segmentation Analysis) Ready! 150 customers ko customer_segments.csv me save karke Annual Income & Spending Score ke basis par 4 business segments (VIP Target, Careful High-Earner, Impulse Buyer, Budget Customer) me divide karta hai!',
    libraries: ['pandas', 'numpy', 'seaborn', 'matplotlib'],
    csvOutput: 'customer_segments.csv',
    keyMetrics: ['Avg Income, Spending Score & Frequency per Segment', 'Customer Count per Segment'],
    chartTypes: ['Annual Income vs Spending Score Cluster Scatterplot'],
    keywords: [
      'customer segmentation',
      'customer_segments',
      'segmentation analysis',
      'spending score',
      'vip target',
      'project 9',
      'project9',
      'hcl 9',
      'p9',
    ],
    code: `import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

np.random.seed(44)

# 1. Generate Customer Dataset
n = 150
income = np.random.randint(20, 140, n)  # Annual income in thousands
score = np.random.randint(5, 99, n)

df = pd.DataFrame({
    "Customer_ID": range(2001, 2001 + n),
    "Annual_Income_k": income,
    "Spending_Score": score,
    "Purchase_Frequency": np.random.randint(1, 25, n)
})

# 2. Segment Customers
def assign_segment(row):
    if row["Annual_Income_k"] >= 75 and row["Spending_Score"] >= 60:
        return "VIP Target"
    elif row["Annual_Income_k"] >= 75 and row["Spending_Score"] < 60:
        return "Careful High-Earner"
    elif row["Annual_Income_k"] < 75 and row["Spending_Score"] >= 60:
        return "Impulse Buyer"
    else:
        return "Budget Customer"

df["Segment"] = df.apply(assign_segment, axis=1)
df.to_csv("customer_segments.csv", index=False)

print("=== CUSTOMER SEGMENTATION SUMMARY ===")
print(df.groupby("Segment")[["Annual_Income_k", "Spending_Score", "Purchase_Frequency"]].mean().round(1))
print("\\nCustomer Count per Segment:\\n", df["Segment"].value_counts())

# 3. Visualization
plt.figure(figsize=(8, 4.5))
sns.scatterplot(data=df, x="Annual_Income_k", y="Spending_Score", hue="Segment", s=70, palette="Set1")
plt.title("Customer Segmentation: Income vs Spending Score")
plt.tight_layout()
plt.show()
`,
  },
  {
    id: 'patient-recovery',
    number: 10,
    slug: 'patient-recovery',
    title: 'Patient Recovery Analysis in Hospital',
    filename: 'project10_patient_recovery.py',
    badge: '🏥 Project 10',
    shortDesc: 'Analyzes hospital length of stay (recovery days), patient age correlation, departments & readmission %.',
    customMessage:
      '🏥 Project 10 (Patient Recovery Analysis in Hospital) Ready! 140 hospital patient records patient_recovery.csv me banata hai, Department-wise Avg Recovery Days & Readmission Rate % nikalta hai, aur Barplot + Age Regression Chart plot karta hai!',
    libraries: ['pandas', 'numpy', 'seaborn', 'matplotlib'],
    csvOutput: 'patient_recovery.csv',
    keyMetrics: ['Avg Recovery Days by Department', 'Overall Readmission Rate (%)', 'Age vs Recovery Regression'],
    chartTypes: ['Avg Recovery Days Barplot', 'Patient Age vs Recovery Stay Regression Plot'],
    keywords: [
      'patient recovery',
      'hospital analysis',
      'patient_recovery',
      'patient analysis',
      'hospital project',
      'readmission',
      'recovery days',
      'project 10',
      'project10',
      'hcl 10',
      'p10',
    ],
    code: `import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

np.random.seed(64)

# 1. Generate Hospital Patient Dataset
n = 140
age = np.random.randint(18, 82, n)
dept = np.random.choice(["Cardiology", "Orthopedics", "General Medicine", "Neurology", "Pediatrics"], n)
recovery_days = np.clip((age * 0.12 + np.random.normal(4, 2, n)), 2, 22).round(1)

df = pd.DataFrame({
    "Patient_ID": [f"PT_{i:04d}" for i in range(1, n + 1)],
    "Age": age,
    "Department": dept,
    "Recovery_Days": recovery_days,
    "Readmitted": np.random.choice(["Yes", "No"], n, p=[0.15, 0.85])
})
df.to_csv("patient_recovery.csv", index=False)

# 2. Analysis
print("=== HOSPITAL PATIENT RECOVERY ANALYSIS ===")
print("Average Recovery Stay (Days) by Department:\\n", df.groupby("Department")["Recovery_Days"].mean().round(2))
readmission_rate = (df["Readmitted"] == "Yes").mean() * 100
print(f"\\nOverall Readmission Rate: {readmission_rate:.1f}%")

# 3. Visualization
plt.figure(figsize=(10, 4))

plt.subplot(1, 2, 1)
sns.barplot(
    data=df,
    x="Department",
    y="Recovery_Days",
    hue="Department",
    estimator="mean",
    palette="Blues_d",
    legend=False
)
plt.title("Avg Recovery Days by Department")
plt.xticks(rotation=25)

plt.subplot(1, 2, 2)
sns.regplot(data=df, x="Age", y="Recovery_Days", scatter_kws={"alpha": 0.5}, line_kws={"color": "red"})
plt.title("Patient Age vs Recovery Stay (Days)")

plt.tight_layout()
plt.show()
`,
  },
];

export const DATA_ANALYTICS_BY_ID: Readonly<Record<string, DataAnalyticsProject>> = Object.freeze(
  DATA_ANALYTICS_PROJECTS.reduce<Record<string, DataAnalyticsProject>>((acc, proj) => {
    acc[proj.id] = proj;
    return acc;
  }, {})
);

export const DATA_ANALYTICS_SUGGESTIONS: readonly string[] = [
  'All 10 HCLTech Data Analytics Python projects dikhao 🐍📊',
  'Budget Tracker Python project code do 💰',
  'E-commerce Dashboard Python code dikhao 🛒',
  'IPL Match Analysis Python project code 🏏',
  'Food Delivery Order Analysis Python code 🍔',
  'Spotify Catalogue Analysis Python code 🎧',
  'Student Performance & Attendance Python code 🎓',
  'OTT Rating Analysis Python code 📺',
  'Weather Trend Analysis Python code 🌦️',
  'Customer Segmentation Python code 👥',
  'Patient Recovery Hospital Python code 🏥',
];

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchesKeyword(query: string, keyword: string): boolean {
  const escaped = escapeRegex(keyword.toLowerCase());
  return new RegExp(`(?<![a-z0-9_])${escaped}(?![a-z0-9_])`, 'i').test(query);
}

export function findMatchingDataAnalyticsProjects(rawQuery: string): {
  mode: 'single' | 'multiple' | 'all' | 'none';
  projects: DataAnalyticsProject[];
} {
  const q = rawQuery.toLowerCase().trim();
  if (!q) return { mode: 'none', projects: [] };

  const isGeneralAnalyticsHub =
    /\b(hcl|hcltech|career\s*shaper|carrier\s*shaper|data\s*analytics|analytics\s*projects?|10\s*projects?|all\s*(?:10\s*)?(?:python|data|da|hcl|analytics)\s*projects?|da\s*projects?|python\s*projects?|pandas\s*projects?|seaborn\s*projects?|matplotlib\s*projects?|eda\s*projects?|pip\s*install\s*pandas)\b/i.test(
      q
    );

  const explicitNumbers = new Set<number>();
  const numRegex = /\b(?:da\s*|data\s*analytics\s*|hcl(?:tech)?\s*|python\s*)?(?:project|proj|pr|code|script|p|hcl)[\s\-_#.]*?(10|[1-9])\b/gi;
  let match: RegExpExecArray | null;
  while ((match = numRegex.exec(q)) !== null) {
    const num = Number.parseInt(match[1], 10);
    if (num >= 1 && num <= 10) explicitNumbers.add(num);
  }

  const matchedById = new Map<string, DataAnalyticsProject>();

  for (const proj of DATA_ANALYTICS_PROJECTS) {
    if (explicitNumbers.has(proj.number)) {
      matchedById.set(proj.id, proj);
      continue;
    }
    if (q.includes(proj.filename.toLowerCase()) || q.includes(proj.csvOutput.toLowerCase())) {
      matchedById.set(proj.id, proj);
      continue;
    }
    if (proj.keywords.some((kw) => matchesKeyword(q, kw))) {
      matchedById.set(proj.id, proj);
    }
  }

  const matchedList = Array.from(matchedById.values()).sort((a, b) => a.number - b.number);

  const asksAllExplicitly = /\b(all|saare|sare|sab|sabhi|complete|full\s*list|10)\b/i.test(q);
  if (isGeneralAnalyticsHub && (matchedList.length === 0 || asksAllExplicitly)) {
    return { mode: 'all', projects: [...DATA_ANALYTICS_PROJECTS] };
  }

  if (matchedList.length === 1) {
    return { mode: 'single', projects: matchedList };
  }

  if (matchedList.length > 1) {
    return { mode: 'multiple', projects: matchedList };
  }

  return { mode: 'none', projects: [] };
}

export function getDataAnalyticsProjectsReply(
  rawQuery: string,
  studentFirstName?: string
): { text: string; nextSugg: string } | null {
  const result = findMatchingDataAnalyticsProjects(rawQuery);
  if (result.mode === 'none') return null;

  const greetingName = studentFirstName?.trim() ? `, ${studentFirstName.trim()}` : '';

  if (result.mode === 'all') {
    const indexLines = DATA_ANALYTICS_PROJECTS.map(
      (p) => `• **${p.number}. ${p.title}** (\`${p.filename}\`) — ${p.shortDesc}`
    ).join('\n');

    return {
      text: `🐍📊 **HCLTECH CAREER SHAPER — ALL 10 DATA ANALYTICS PYTHON PROJECTS UNLOCKED${greetingName.toUpperCase()}!** 🚀✨

Neeche **interactive project vault** me saare **10 Python scripts** live hain—har project ke saath **One-Click Copy Code**, **Copy \`pip install\`**, **Download \`.py\`**, aur **Custom Guide Message** hai!

[DA_PROJECT|all]

### 📋 Quick Project Index (Ask by Name or Project Number 1–10):
${indexLines}

💡 *Tip: Kisi bhi single project ke liye bas uska naam ya number likho — jaise **"Project 3"**, **"Spotify analysis"**, ya **"Patient recovery code"**!*`,
      nextSugg: 'Project 6 Student Performance Python code dikhao 🎓',
    };
  }

  if (result.mode === 'single') {
    const proj = result.projects[0];
    const nextProj = DATA_ANALYTICS_PROJECTS[proj.number % DATA_ANALYTICS_PROJECTS.length];

    return {
      text: `${proj.badge} **${proj.title.toUpperCase()} — READY-TO-RUN PYTHON CODE${greetingName.toUpperCase()}!** 🐍✨

[DA_PROJECT|${proj.id}]

• **📁 Save File As:** \`${proj.filename}\`
• **📄 Auto-Generated CSV:** \`${proj.csvOutput}\` *(zero missing-file errors!)*
• **📈 Outputs:** ${proj.keyMetrics.join(' • ')}`,
      nextSugg: `Project ${nextProj.number} ${nextProj.title} Python code dikhao 🐍`,
    };
  }

  const cards = result.projects
    .map((proj) => `### ${proj.badge} ${proj.title} (\`${proj.filename}\`)\n\n[DA_PROJECT|${proj.id}]`)
    .join('\n\n---\n\n');

  return {
    text: `🐍🔥 **MATCHED ${result.projects.length} DATA ANALYTICS PYTHON PROJECTS${greetingName.toUpperCase()}!** 📊✨\n\n${cards}`,
    nextSugg: 'All 10 HCLTech Data Analytics Python projects dikhao 🐍📊',
  };
}
