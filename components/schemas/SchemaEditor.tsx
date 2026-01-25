"use client";

import { useState, useEffect } from "react";
import {
  TableSchema,
  SchemaAttribute,
  DynamoDBType,
  KeyType,
} from "@/lib/types";
import { dynamoDBTypeLabels } from "@/lib/mock-data";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

interface SchemaEditorProps {
  schema: TableSchema | null;
  onSave: (schema: TableSchema) => void;
  onDelete?: (id: string) => void;
  onCancel: () => void;
}

const keyTypeOptions = [
  { value: "S", label: "String (S)" },
  { value: "N", label: "Number (N)" },
  { value: "B", label: "Binary (B)" },
];

const attributeTypeOptions = Object.entries(dynamoDBTypeLabels).map(
  ([value, label]) => ({
    value,
    label: `${label} (${value})`,
  })
);

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function SchemaEditor({
  schema,
  onSave,
  onDelete,
  onCancel,
}: SchemaEditorProps) {
  const isNew = !schema;

  const [tableName, setTableName] = useState(() => schema?.tableName || "");
  const [partitionKeyName, setPartitionKeyName] = useState(
    () => schema?.partitionKey.name || ""
  );
  const [partitionKeyType, setPartitionKeyType] = useState<KeyType>(
    () => schema?.partitionKey.type || "S"
  );
  const [hasSortKey, setHasSortKey] = useState(() => !!schema?.sortKey);
  const [sortKeyName, setSortKeyName] = useState(
    () => schema?.sortKey?.name || ""
  );
  const [sortKeyType, setSortKeyType] = useState<KeyType>(
    () => schema?.sortKey?.type || "S"
  );
  const [attributes, setAttributes] = useState<SchemaAttribute[]>(
    () => schema?.attributes || []
  );

  const addAttribute = () => {
    setAttributes([...attributes, { name: "", type: "S", required: false }]);
  };

  const updateAttribute = (
    index: number,
    updates: Partial<SchemaAttribute>
  ) => {
    setAttributes(
      attributes.map((attr, i) =>
        i === index ? { ...attr, ...updates } : attr
      )
    );
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newSchema: TableSchema = {
      id: schema?.id || generateId(),
      tableName,
      partitionKey: { name: partitionKeyName, type: partitionKeyType },
      sortKey: hasSortKey
        ? { name: sortKeyName, type: sortKeyType }
        : undefined,
      attributes: attributes.filter((attr) => attr.name.trim() !== ""),
    };

    onSave(newSchema);
  };

  return (
    <Card padding="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-text-primary">
            {isNew ? "Create New Schema" : "Edit Schema"}
          </h2>
          {!isNew && onDelete && (
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => onDelete(schema.id)}
            >
              Delete
            </Button>
          )}
        </div>

        <Input
          label="Table Name"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          placeholder="e.g., Users, Orders, Products"
          required
        />

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
            Key Schema
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Partition Key Name"
              value={partitionKeyName}
              onChange={(e) => setPartitionKeyName(e.target.value)}
              placeholder="e.g., userId"
              required
            />
            <Select
              label="Partition Key Type"
              value={partitionKeyType}
              onChange={(e) => setPartitionKeyType(e.target.value as KeyType)}
              options={keyTypeOptions}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hasSortKey"
              checked={hasSortKey}
              onChange={(e) => setHasSortKey(e.target.checked)}
              className="w-4 h-4 rounded border-border bg-bg-tertiary text-accent focus:ring-accent"
            />
            <label htmlFor="hasSortKey" className="text-sm text-text-secondary">
              Include Sort Key
            </label>
          </div>

          {hasSortKey && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Sort Key Name"
                value={sortKeyName}
                onChange={(e) => setSortKeyName(e.target.value)}
                placeholder="e.g., createdAt"
                required={hasSortKey}
              />
              <Select
                label="Sort Key Type"
                value={sortKeyType}
                onChange={(e) => setSortKeyType(e.target.value as KeyType)}
                options={keyTypeOptions}
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
              Attributes
            </h3>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addAttribute}
            >
              Add Attribute
            </Button>
          </div>

          {attributes.length === 0 ? (
            <div className="text-center py-6 text-text-secondary text-sm border border-dashed border-border rounded-lg">
              No attributes defined. Click &quot;Add Attribute&quot; to add one.
            </div>
          ) : (
            <div className="space-y-3">
              {attributes.map((attr, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_1fr_auto_auto] gap-3 items-end"
                >
                  <Input
                    label={index === 0 ? "Name" : undefined}
                    value={attr.name}
                    onChange={(e) =>
                      updateAttribute(index, { name: e.target.value })
                    }
                    placeholder="attributeName"
                  />
                  <Select
                    label={index === 0 ? "Type" : undefined}
                    value={attr.type}
                    onChange={(e) =>
                      updateAttribute(index, {
                        type: e.target.value as DynamoDBType,
                      })
                    }
                    options={attributeTypeOptions}
                  />
                  <div
                    className={`flex items-center gap-2 ${index === 0 ? "mt-6" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={attr.required}
                      onChange={(e) =>
                        updateAttribute(index, { required: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-border bg-bg-tertiary text-accent focus:ring-accent"
                    />
                    <span className="text-sm text-text-secondary">
                      Required
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttribute(index)}
                    className={index === 0 ? "mt-6" : ""}
                  >
                    <svg
                      className="w-4 h-4 text-error"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isNew ? "Create Schema" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
