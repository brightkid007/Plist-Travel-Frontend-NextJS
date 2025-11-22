"use client";

import { useState, useEffect, useRef } from "react";
import { Checkbox } from "@mui/material";
import { getMyListings, getListingCategories, getListingSubcategories, getRoomTypes } from "@/helpers/backend_helper";

const RoomType = ({ onRoomTypeIdsChange, roomTypeIds = [] }) => {
    const [listings, setListings] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoomTypeIds, setSelectedRoomTypeIds] = useState(roomTypeIds);
    const [treeData, setTreeData] = useState([]);
    const [availableRoomTypes, setAvailableRoomTypes] = useState({}); // Map of listingId -> roomTypes

    // Load all data
    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllRoomTypes = async (listings) => {
        if (listings.length === 0) {
            setAvailableRoomTypes({});
            return;
        }

        try {
            // Fetch all room types in a single API call
            const response = await getRoomTypes().catch(() => ({ data: [] }));
            const allRoomTypes = response?.data || [];

            // Group room types by listing_id on the frontend
            const roomTypesMap = {};
            listings.forEach((listing) => {
                roomTypesMap[listing.id] = allRoomTypes.filter(
                    (roomType) => roomType.listing_id === listing.id
                );
            });

            setAvailableRoomTypes(roomTypesMap);
        } catch (error) {
            console.error("Error loading room types:", error);
            setAvailableRoomTypes({});
        }
    };

    const loadAllData = async () => {
        try {
            setLoading(true);
            const [listingsRes, categoriesRes, subcategoriesRes] = await Promise.all([
                getMyListings({ type: "property" }).catch(() => ({ data: [] })),
                getListingCategories().catch(() => ({ data: [] })),
                getListingSubcategories().catch(() => ({ data: [] })),
            ]);

            setListings(listingsRes?.data || []);
            setCategories(categoriesRes?.data || categoriesRes || []);
            setSubcategories(subcategoriesRes?.data || subcategoriesRes || []);
            if (listingsRes?.data?.length > 0) {
                loadAllRoomTypes(listingsRes?.data || []);
            }
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };


    const buildTree = () => {
        const tree = {
            id: "all",
            label: "All",
            checked: false,
            children: [],
        };

        // Group by subtype (for properties)
        const listingsBySubtype = {};
        listings.forEach((listing) => {
            const subtype = listing.subtype || "Other";
            if (!listingsBySubtype[subtype]) {
                listingsBySubtype[subtype] = [];
            }
            listingsBySubtype[subtype].push(listing);
        });

        // Build tree structure: Subtype → Category → Subcategory → Listing → Room Types
        for (const subtype of Object.keys(listingsBySubtype)) {
            const subtypeNode = {
                id: `subtype-${subtype}`,
                label: subtype,
                checked: false,
                children: [],
            };

            // Group by category
            const listingsByCategory = {};
            listingsBySubtype[subtype].forEach((listing) => {
                const categoryId = listing.category_id || listing.listing_category_id;
                if (categoryId) {
                    const category = categories.find((cat) => cat.id === categoryId);
                    const categoryName = category?.name || `Category ${categoryId}`;
                    if (!listingsByCategory[categoryName]) {
                        listingsByCategory[categoryName] = { id: categoryId, listings: [] };
                    }
                    listingsByCategory[categoryName].listings.push(listing);
                } else {
                    if (!listingsByCategory["Uncategorized"]) {
                        listingsByCategory["Uncategorized"] = { id: null, listings: [] };
                    }
                    listingsByCategory["Uncategorized"].listings.push(listing);
                }
            });

            for (const categoryName of Object.keys(listingsByCategory)) {
                const categoryData = listingsByCategory[categoryName];
                const categoryNode = {
                    id: categoryData.id ? `category-${categoryData.id}` : "category-uncategorized",
                    label: categoryName,
                    checked: false,
                    children: [],
                };

                // Group by subcategory
                const listingsBySubcategory = {};
                categoryData.listings.forEach((listing) => {
                    const subcategoryId = listing.subcategory_id || listing.listing_subcategory_id;
                    if (subcategoryId) {
                        const subcategory = subcategories.find((subcat) => subcat.id === subcategoryId);
                        const subcategoryName = subcategory?.name || `Subcategory ${subcategoryId}`;
                        if (!listingsBySubcategory[subcategoryName]) {
                            listingsBySubcategory[subcategoryName] = { id: subcategoryId, listings: [] };
                        }
                        listingsBySubcategory[subcategoryName].listings.push(listing);
                    } else {
                        if (!listingsBySubcategory["Uncategorized"]) {
                            listingsBySubcategory["Uncategorized"] = { id: null, listings: [] };
                        }
                        listingsBySubcategory["Uncategorized"].listings.push(listing);
                    }
                });

                for (const subcategoryName of Object.keys(listingsBySubcategory)) {
                    const subcategoryData = listingsBySubcategory[subcategoryName];
                    const subcategoryNode = {
                        id: subcategoryData.id ? `subcategory-${subcategoryData.id}` : "subcategory-uncategorized",
                        label: subcategoryName,
                        checked: false,
                        children: [],
                    };

                    // For each listing, add room types as children
                    for (const listing of subcategoryData.listings) {
                        const listingNode = {
                            id: `listing-${listing.id}`,
                            label: listing.title || listing.name || `Listing ${listing.id}`,
                            checked: false,
                            listingId: listing.id,
                            isListing: true,
                            children: [],
                        };

                        // Add room types as children (pre-loaded for all listings)
                        if (availableRoomTypes[listing.id] && availableRoomTypes[listing.id].length > 0) {
                                                        listingNode.children = availableRoomTypes[listing.id].map((roomType) => {
                                const roomTypeId = parseInt(roomType.id, 10);
                                return {
                                    id: `room-type-${roomTypeId}`,
                                    label: roomType.name || `Room Type ${roomTypeId}`,
                                    checked: selectedRoomTypeIds.includes(roomTypeId),
                                    roomTypeId: roomTypeId,
                                    isRoomType: true,
                                };
                            });

                            // Set parent checked state based on children
                            const allChildrenChecked = listingNode.children.length > 0 &&
                                listingNode.children.every((child) => child.checked);
                            listingNode.checked = allChildrenChecked;
                        }

                        subcategoryNode.children.push(listingNode);
                    }

                    categoryNode.children.push(subcategoryNode);
                }

                subtypeNode.children.push(categoryNode);
            }

            tree.children.push(subtypeNode);
        }

        return [tree];
    };

    // Build tree structure
    useEffect(() => {
        if (loading || listings.length === 0) {
            setTreeData([]);
            return;
        }

        setTreeData(buildTree());
    }, [listings, categories, subcategories, availableRoomTypes, selectedRoomTypeIds, loading]);

    // Helper function to extract selected IDs from tree data
    const extractSelectedIds = (nodes) => {
        const roomTypeIds = [];

        const traverse = (items) => {
            items.forEach((item) => {
                if (item.isRoomType && item.checked) {
                    roomTypeIds.push(item.roomTypeId);
                }
                if (item.children && item.children.length > 0) {
                    traverse(item.children);
                }
            });
        };

        traverse(nodes);
        return { roomTypeIds };
    };


    const updateNodeAndChildren = (nodes, id, checked) => {
        return nodes.map((node) => {
            if (node.id === id) {
                return {
                    ...node,
                    checked,
                    children: node.children
                        ? updateNodeAndChildren(node.children, "found", checked)
                        : undefined,
                };
            }

            if (id == "found") {
                if (node.children) {
                    return {
                        ...node,
                        checked,
                        children: updateNodeAndChildren(node.children, "found", checked),
                    };
                }
                return {
                    ...node,
                    checked,
                };
            }

            if (node.children) {
                return {
                    ...node,
                    children: updateNodeAndChildren(node.children, id, checked),
                };
            }

            return node;
        });
    };

    const updateParentStates = (nodes) => {
        return nodes.map((node) => {
            if (node.children && node.children.length > 0) {
                const updatedChildren = updateParentStates(node.children);
                const allChecked = updatedChildren.every((child) => child.checked);

                return {
                    ...node,
                    checked: allChecked,
                    children: updatedChildren,
                };
            }
            return node;
        });
    };

    const handleCheckboxChange = (event) => {
        const { id, checked } = event.target;
        setTreeData((prevData) => {
            const updatedData = updateNodeAndChildren(prevData, id, checked);
            const finalData = updateParentStates(updatedData);
            return finalData;
        });
    };

    // Notify parent when tree changes (only if not updating from props)
    useEffect(() => {        
        const { roomTypeIds: extractedIds } = extractSelectedIds(treeData);
        console.log("treeData", extractedIds);
        onRoomTypeIdsChange(extractedIds);
    }, [treeData]);

    const renderCheckboxes = (items) => {
        return items.map((item, key) => (
            <div key={key}>
                <div className="d-flex items-center">
                    <Checkbox
                        id={item.id}
                        checked={item.checked ? true : false}
                        onChange={handleCheckboxChange}
                    />
                    <div className="text-14 lh-14 ml-5">{item.label}</div>
                </div>
                {item.children && item.children.length > 0 && (
                    <div className="ml-30">{renderCheckboxes(item.children)}</div>
                )}
            </div>
        ));
    };

    if (loading) {
        return <div className="text-14 text-light-1 ml-20 mt-10">Loading listings...</div>;
    }

    return (
        <div className="ml-20 mt-10">
            <div className="text-16 fw-500 mb-10">Select Listing and Room Types</div>
            {treeData.length > 0 ? (
                renderCheckboxes(treeData)
            ) : (
                <div className="text-14 text-light-1">No listings available</div>
            )}
        </div>
    );
};

export default RoomType;
